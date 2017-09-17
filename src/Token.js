/*
 * Embassy
 * Copyright (c) 2017 Tom Shawver LLC
 */

'use strict'

const base64 = require('base64-js')
const jwt = require('jsonwebtoken')
const KeyNotFoundError = require('./errors/KeyNotFoundError')
const PermissionNotFoundError = require('./errors/PermissionNotFoundError')
const TokenParseError = require('./errors/TokenParseError')

class Token {
  /**
   * Creates a new Token.
   * @param {Object} opts An object mapping of configuration objects
   * @param {Object} [opts.claims] A mapping of JWT claims to set in the new token
   * @param {string} [opts.token] A token string with which to initialize this Token object. Its claims,
   * permissions, options, and headers will all be imported, and its signature will be made available
   * to the {@link #verify} function.
   * @param {Object} [opts.domainPermissions] A mapping of permission domains to permission maps.
   * Permission maps are a mapping of permission strings to a unique integer, starting at 0 and incrementing
   * upward, like the opposite of an array. Once set, it's important that a permission's index not be
   * changed, or else tokens issued with the previous mapping will be granted unexpected permissions.
   * @param {Object} [opts.keys] A mapping of key IDs to key objects used for signing and verifying tokens.
   * Key objects have the following format:
   * {
   *   "pub": "PEM-formatted public key, or HMAC secret",
   *   "priv": "PEM-formatted private key, or HMAC secret",
   *   "algo": "Key algorithm, such as ES256 or RS512"
   * }
   * Supported algorithms are listed at https://github.com/auth0/node-jsonwebtoken#algorithms-supported
   * @param {Function} [opts.refreshPermissions] If specified, this function will be called if a permission
   * is encountered that Embassy is not yet aware of. The function should return either a new value for
   * domainPermissions, or a promise that resolves to the domainPermissions. Calls involving unknown
   * permissions will fail only if this function does not provide the permission in question.
   * @param {number} [opts.refreshPermsAfterMs=500] The number of milliseconds after the domainPermissions
   * map has been refreshed that it is eligible to be refreshed again. During this time, the permission map
   * will not attempt to update before throwing a {@link PermissionNotFoundError}.
   * @param {Function} [opts.getPrivKey] In the event that {@link #sign} is called with a key ID that Embassy doesn't
   * currently know about, this function (if specified) will be called with the key ID string as the only argument.
   * It must return either an object with a "priv" and "algo" property (referring to the PEM-formatted private key or
   * HMAC secret, and the key algorithm, respectively), or a promise that resolves to the same.
   * @param {Function} [opts.getPubKey] In the event a token with an unknown key ID needs to be verified,
   * this function (if specified) will be called with the key ID string as the only argument. It can either
   * return the PEM-encoded public key (or HMAC secret) for this ID, or a promise that resolves with the same.
   * @param {number} [opts.expiresInSecs=900] The number of seconds after which an issued token should
   * expire by default.
   * @param {string} [opts.audience] The default audience to store in created tokens. The audience is an
   * arbitrary string, usually a hostname that identifies the intended consumer(s) of the token. Note that
   * providing this will cause token verification to fail if the token's audience string does not match
   * this. To avoid that behavior, provide the audience as an option to {@link Token#sign}.
   * @param {string} [opts.issuer] The token issuer string to use by default. Note that providing this will
   * cause token verification to fail if the token's issuer string does not match this. To avoid that
   * behavior, provide the issuer as an option to {@link Token#sign}.
   * @throws {TokenParseError} if the provided token cannot be parsed
   */
  constructor(opts) {
    const optDefaults = {
      expiresInSecs: 900,
      permsLastUpdate: 0,
      refreshPermsAfterMs: 500,
      keys: {},
      domainPermissions: {}
    }
    this._opts = Object.assign({}, optDefaults, opts || {})
    if (this._opts.token) {
      this._token = this._opts.token
      const decoded = jwt.decode(this._token, {
        complete: true,
        json: true
      })
      if (!decoded) throw new TokenParseError(`Bad token: ${this._token}`)
      this._header = decoded.header
      this._claims = decoded.payload
    }
    this._claims = Object.assign(this._claims || {}, this._opts.claims || {})
    this._blobs = {}
    this._decodeBlobs()
  }

  /**
   * Gets the content of a claim.
   * @param {string} claim The name of the claim for which the value should be retrieved
   * @returns {*} The value of the claim, or undefined if the claim does not exist
   */
  getClaim(claim) {
    return this._claims.hasOwnProperty(claim) ? this._claims[claim] : undefined
  }

  /**
   * Gets the content of a domain-specific option
   * @param {string} domain The domain containing the requested option
   * @param {string} key The name of the option for which the value should be retrieved
   * @returns {*} The value of the targeted option, or undefined if the option does not exist
   */
  getOption(domain, key) {
    if (this._claims.opt && this._claims.opt[domain]) {
      return this._claims.opt[domain][key]
    }
    // Redundant; included for clarity and consistent return points
    return undefined
  }

  /**
   * Grants the given permission to this token. See the src/maps folder for domain files
   * containing permission names.
   * @param {string} domain The domain that contains the permission to be granted
   * @param {string} perm The name of the permission to be granted
   * @returns {Promise} Resolves when the permission has been granted, rejects if the given permission
   * does not exist
   */
  grantPermission(domain, perm) {
    return this._getPermComponents(domain, perm, true).then(pc => {
      // Bitwise OR together the original byte with the bit mask to set the permission bit
      pc.blob[pc.offset] = pc.byte | pc.mask
      this._blobs[domain] = pc.blob
    })
  }

  /**
   * Grants the given array of permissions to this token. See the src/maps folder for
   * domain files containing permission names.
   * @param {string} domain The domain that contains the permissions to be granted
   * @param {Array<string>} perms An array of permissions to be granted
   * @returns {Promise} Resolves when the permissions have been granted, rejects if any given permission
   * does not exist
   */
  grantPermissions(domain, perms) {
    let chain = Promise.resolve()
    perms.forEach(perm => {
      chain = chain.then(() => this.grantPermission(domain, perm))
    })
    return chain
  }

  /**
   * Checks to see whether this token has had a given permission granted
   * @param {string} domain The domain that contains the permission to be checked
   * @param {string} perm The permission to be checked
   * @returns {Promise.<boolean>} Resolves true if the permission has been set; false otherwise.
   * Rejects if the permission does not exist.
   */
  hasPermission(domain, perm) {
    return this._getPermComponents(domain, perm).then(pc => {
      // Use bitwise AND to determine if the byte contains the bit mask
      return pc.byte ? (pc.byte & pc.mask) === pc.mask : false
    })
  }

  /**
   * Checks to see whether this token has had each permission in an array granted
   * @param {string} domain The domain that contains the permissions to be checked
   * @param {Array<string>} perms An array of permissions to be checked
   * @returns {Promise.<boolean>} Resolves true if each permission has been set; false otherwise.
   * Rejects if any given permission does not exist.
   */
  hasPermissions(domain, perms) {
    let chain = Promise.resolve(true)
    perms.forEach(perm => {
      chain = chain.then((pass) => {
        if (!pass) return false
        return this.hasPermission(domain, perm)
      })
    })
    return chain
  }

  /**
   * Revokes a permission that has been previously granted. This method is idempotent
   * and will not fail when revoking permissions that have not been granted.
   * @param {string} domain The domain that contains the permission to be revoked
   * @param {string} perm The permission to be revoked
   * @returns {Promise} Resolves when the permission has been revoked, rejects if the
   * permission does not exist.
   */
  revokePermission(domain, perm) {
    return this._getPermComponents(domain, perm).then(pc => {
      if (pc.byte) {
        // Use bitwise AND with the inverse of the bit mask to unset the permission bit
        pc.blob[pc.offset] = pc.byte & ~pc.mask
        this._blobs[domain] = pc.blob
      }
    })
  }

  /**
   * Revokes an array of permissions that have been previously granted. This method is
   * idempotent and will not fail when revoking permissions that have not been granted.
   * @param {string} domain The domain that contains the permissions to be revoked
   * @param {Array<string>} perms An array of permissions to be revoked
   * @returns {Promise} Resolves when each permission has been revoked, rejects if any given
   * permission does not exist.
   */
  revokePermissions(domain, perms) {
    let chain = Promise.resolve()
    perms.forEach(perm => {
      chain = chain.then(() => this.revokePermission(domain, perm))
    })
    return chain
  }

  /**
   * Sets a claim within the body of the JSON Web Token. Note that standard claims such
   * as issuer, subscriber, etc., can be set automatically in the {@link Token#sign} method.
   * @param {string} claim The name of the claim to be set
   * @param {*} val The value for the claim
   */
  setClaim(claim, val) {
    this._claims[claim] = val
  }

  /**
   * Sets a domain-specific option on this token. Options are meant for holding non-boolean
   * settings. For boolean values, consider defining a new permission for this domain.
   * @param {string} domain The domain in which to set the given option
   * @param {string} key The name of the option to be set
   * @param {*} val The value for the option
   */
  setOption(domain, key, val) {
    if (!this._claims.opt) this._claims.opt = {}
    if (!this._claims.opt[domain]) this._claims.opt[domain] = {}
    this._claims.opt[domain][key] = val
  }

  /**
   * Serializes the data set within this Token instance and signs it with a private key. The result is a
   * JWT token string.
   * @param {string} kid An identifier for the key pair used to sign this token. The key pair must exist in the
   * `keys` map passed in the constructor options.
   * @param {Object} [opts] A mapping of settings for this signature
   * @param {string} [opts.expiresInSecs=900] The amount of time in seconds, starting from now, that this
   * token should remain valid
   * @param {string} [opts.audience] A string representing the intended audience for this token
   * @param {string} [opts.subject] The ID of the intended user of this token. Optional only if a 'sub' claim has
   * already been set.
   * @param {string} [opts.issuer] A string representing the issuer of this token
   * @param {string} [opts.noTimestamp=false] If true, this method will not generate an 'iat'
   * claim (an issued-at timestamp)
   * @param {Object} [opts.header={}] A mapping of keys and values to be set in the token
   * header, additionally to what the signing process creates by default
   * @returns {Promise.<string>} Resolves with the token string. Rejects if the signing key is not valid.
   * @throws {Error} If options.subject was not specified, and the 'sub' claim has not been set
   */
  sign(kid, opts) {
    opts = opts || {}
    if (!opts.subject && !this._claims.sub) throw new Error('A subject is required')
    this._encodeBlobs()
    delete this._claims.exp
    const params = {
      expiresIn: ((opts.expiresInSecs || this._opts.expiresInSecs) * 1000).toString(),
      audience: opts.audience || this._opts.audience,
      subject: opts.subject,
      issuer: opts.issuer || this._opts.issuer,
      noTimestamp: opts.noTimestamp,
      header: opts.header || {}
    }
    params.header.kid = kid
    return Promise.resolve().then(() => {
      if ((!this._opts.keys[kid] || !this._opts.keys[kid].priv) && this._opts.getPrivKey) {
        return this._opts.getPrivKey(kid, this)
      }
      if (!this._opts.keys[kid])  throw new KeyNotFoundError(`Key ID "${kid}" not found in key map`)
      if (!this._opts.keys[kid].priv) throw new KeyNotFoundError(`Key ID "${kid}" requires a 'priv' property`)
      if (!this._opts.keys[kid].algo) throw new KeyNotFoundError(`Key ID "${kid}" requires an 'algo' property`)
      return {
        priv: this._opts.keys[kid].priv,
        algo: this._opts.keys[kid].algo
      }
    }).then(key => {
      if (!this._opts.keys[kid]) this._opts.keys[kid] = key
      else Object.assign(this._opts.keys[kid], key)
      return new Promise((resolve, reject) => {
        params.algorithm = key.algo
        jwt.sign(this._claims, key.priv, params, (err, token) => {
          if (err) return reject(err)
          this._token = token
          const decoded = jwt.decode(token, {complete: true})
          this._header = decoded.header
          return resolve(token)
        })
      })
    })
  }

  /**
   * Verifies a token's validity by checking its signature, expiration time, and contents.
   * @param {Object} [opts] A mapping of options to customize the verification process
   * @param {Array<string>} [opts.algorithms] List of strings with the names of the allowed
   * algorithms. For instance, ["HS256", "HS384"]. Allows all algorithms if omitted.
   * @param {string} [opts.audience] Ensures the token's audience string matches this value
   * @param {string} [opts.issuer] Ensures the token's issuer string
   * matches this value
   * @param {boolean} [opts.ignoreExpiration=false] If true, expired tokens will pass
   * verification checks
   * @param {number} [opts.maxAgeSecs] If specified, will fail verification if the token is older
   * than the specified number of seconds
   * @params {string|Buffer} [opts.key] The PEM-encoded public key to be used to verify the
   * token's signature. If specified, the key ID will be ignored.
   * @returns {Promise.<Object>} Resolves with the decoded token payload on success; rejects
   * if the token fails to pass verification checks.
   */
  verify(opts) {
    opts = opts || {}
    const params = {
      issuer: opts.issuer || this._opts.issuer,
      audience: opts.audience || this._opts.audience,
      ignoreExpiration: opts.ignoreExpiration || false,
      maxAge: opts.maxAgeSecs ? (opts.maxAgeSecs * 1000).toString() : undefined
    }
    return Promise.resolve().then(() => {
      if (!this._token) {
        throw new Error('No token string to verify')
      }
      if (opts.key) return opts.key
      if (this._opts.keys[this._header.kid] && this._opts.keys[this._header.kid].pub) {
        return this._opts.keys[this._header.kid].pub
      }
      if (this._opts.getPubKey) {
        return Promise.resolve(this._opts.getPubKey(this._header.kid, this)).then(pubKey => {
          if (!this._opts.keys[this._header.kid]) this._opts.keys[this._header.kid] = {}
          this._opts.keys[this._header.kid].pub = pubKey
          return pubKey
        })
      }
      throw new KeyNotFoundError(`Cannot find pubKey for ID "${this._header.kid}"`)
    }).then(key => {
      return new Promise((resolve, reject) => {
        jwt.verify(this._token, key, params, (err, decoded) => {
          if (err) reject(err)
          else resolve(decoded)
        })
      })
    })
  }

  /**
   * Decodes the 'prm' permissions claim into a mapping of domain string to byte array, stored in `this._blobs`.
   * @private
   */
  _decodeBlobs() {
    if (this._claims.prm) {
      const segments = this._claims.prm.split(/[;:]/)
      for (let i = 0; i < segments.length; i += 2) {
        this._blobs[segments[i]] = base64.toByteArray(segments[i + 1])
      }
    }
  }

  /**
   * Encodes `this._blobs` into a single string in the format domain1:base64perms1;domain2:base64perms2 (etc) and
   * stores it into the 'prm' claim.
   * @private
   */
  _encodeBlobs() {
    const segments = []
    for (let domain in this._blobs) {
      /* istanbul ignore else */
      if (this._blobs.hasOwnProperty(domain)) {
        let segment = `${domain}:`
        segment += base64.fromByteArray(this._blobs[domain])
        segments.push(segment)
      }
    }
    this._claims.prm = segments.join(';')
  }

  /**
   * Retrieves a byte array from the set of domain blobs, resizing it if necessary.
   * @param {string} domain The domain string for which to get the permissions blob
   * @param {number} [minBytes] The number of bytes the resulting array should have in it, at minimum
   * @returns {Array<number>} The byte array for the given domain
   * @private
   */
  _getBlob(domain, minBytes) {
    const blob = this._blobs[domain] || []
    while (blob.length < (minBytes || 0)) blob.push(0)
    return blob
  }

  /**
   * Gets the binary components of an individual permission, as a map of key/value pairs. The components are:
   * - {number} idx: The permission's index, from the domainPermissions map
   * - {number} offset: The index of the byte inside the blob that contains this permission's bit
   * - {Array<number>} blob: The full array of bytes defining this domain's permission blob
   * - {number} byte: The individual target byte of the blob (same as blob[offset])
   * - {number} mask: The bitmask targeting the individual permission bit in the provided byte
   * @param {string} domain The domain containing the target permission
   * @param {string} perm The name of the permission for which to retrieve the components
   * @param {boolean} [resize=false] true to resize the resulting blob to fit the chosen permission bit; false
   * to return it in the currently stored size
   * @returns {Promise<{idx: number, offset: number, blob: Array<number>, byte: number, mask: number}>} Resolves with
   * the components of the given permission
   * @private
   */
  _getPermComponents(domain, perm, resize) {
    const pc = {}
    return this._getPermIndex(domain, perm).then(idx => {
      pc.idx = idx
      pc.offset = Math.floor(idx / 8)
      pc.blob = this._getBlob(domain, resize ? pc.offset + 1 : 0)
      pc.byte = pc.blob[pc.offset]
      pc.mask = Math.pow(2, idx % 8)
      return pc
    })
  }

  /**
   * Gets the index of the specified permission from the domainPermissions map. If it's not found, this method attempts
   * to refresh that map with the refreshPermissions method.
   * @param {string} domain The domain containing the target permission
   * @param {string} perm The name of the target permission
   * @param {boolean} [noRetry=false] true to not attempt to refresh the domainPermissions map and retry this function
   * @returns {Promise<number>} Resolves with the index of the target permission
   * @private
   */
  _getPermIndex(domain, perm, noRetry) {
    const map = this._opts.domainPermissions[domain]
    if (!map || !map.hasOwnProperty(perm)) {
      const updateAfter = this._opts.permsLastUpdate + this._opts.refreshPermsAfterMs
      if (noRetry || !this._opts.refreshPermissions || Date.now() < updateAfter) {
        return Promise.reject(new PermissionNotFoundError(`Permission name does not exist: ${domain}.${perm}`))
      }
      return Promise.resolve(this._opts.refreshPermissions(this)).then(domainPermissions => {
        this._opts.permsLastUpdate = Date.now()
        Object.assign(this._opts.domainPermissions, domainPermissions)
        return this._getPermIndex(domain, perm, true)
      })
    }
    return Promise.resolve(map[perm])
  }
}

module.exports = Token
