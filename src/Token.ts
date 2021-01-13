/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

import base64 from 'base64-js'
import jwt from 'jsonwebtoken'
import { KeyNotFoundError } from './errors/KeyNotFoundError'
import { ScopeNotFoundError } from './errors/ScopeNotFoundError'
import { TokenParseError } from './errors/TokenParseError'
import {
  Claims,
  DomainScopes,
  JWTHeader,
  PrivateKeyDefinition,
  ScopeComponents,
  Serializable,
  SigningAlgorithm,
  TokenOptions,
  TokenSigningOptions,
  TokenVerificationOptions,
  symmetricAlgorithms
} from './types'
import { forEachScope, splitCombined } from './util'

export class Token {
  private scopesLastUpdate = 0
  private opts: TokenOptions = {
    refreshScopesAfterMs: 1000,
    keys: {},
    domainScopes: {},
    expiresInSecs: 3600
  }
  private token: string
  private domainBlobs: Record<string, Uint8Array> = {}
  public claims: Claims = {}
  public header: JWTHeader

  /**
   * Creates a new Token.
   *
   * @param opts - An object mapping of configuration objects
   * @throws {@link TokenParseError}
   * Thrown if the provided token cannot be parsed
   */
  constructor(opts: TokenOptions = {}) {
    const { token, claims, ...rest } = opts
    this.claims = claims || {}
    this.opts = { ...this.opts, ...rest }
    if (token) {
      this.token = token
      const decoded = jwt.decode(token, {
        complete: true,
        json: true
      })
      if (!decoded) throw new TokenParseError(`Bad token: ${token}`)
      this.header = decoded.header
      this.claims = decoded.payload
    }
    this.decodeBlobs()
  }

  /**
   * Gets the content of a domain-specific option.
   *
   * @param domain - The domain containing the requested option
   * @param key - The name of the option for which the value should be retrieved
   * @returns The value of the requested option, or undefined
   */
  getOption<T extends Serializable>(
    domain: string,
    key: string
  ): T | undefined {
    return this.claims.opt?.[domain]?.[key]
  }

  /**
   * Grants the given scope to this token within the specified domain.
   *
   * @param domain - The domain that contains the scope to be granted
   * @param scope - The name of the scope to be granted
   */
  async grantScope(domain: string, scope: string): Promise<void>

  /**
   * Grants the given scope to this token. If the scope string contains a `|`
   * character, the string up to the first `|` will be used as the domain under
   * which the scope will be grouped. Otherwise, the default domain of `app`
   * will be used.
   *
   * @param combined - The scope string to be granted, optionally containing a
   * domain in the format `domain|scopeName`
   */
  async grantScope(combined: string): Promise<void>
  async grantScope(domainOrCombined: string, scope?: string): Promise<void> {
    const parts = scope
      ? { domain: domainOrCombined, key: scope }
      : splitCombined(domainOrCombined)
    const comps = await this.getScopeComponents(parts.domain, parts.key, true)
    // Bitwise OR together the original byte with the bit mask to set the bit
    comps.blob[comps.offset] = comps.byte | comps.mask
    this.domainBlobs[parts.domain] = comps.blob
  }

  /**
   * Grants the given array of scopes to this token.
   *
   * @param domainScopes - A map of domains to arrays of scopes in that domain
   * to be granted to the token
   */
  async grantScopes(domainScopes: DomainScopes): Promise<void>

  /**
   * Grants the given array of scopes to this token.
   *
   * @param combined - An array of strings in the format `domain|scope`. If the
   * domain portion is missing, the default scope of "app" will be used.
   */
  async grantScopes(combined: string[]): Promise<void>
  async grantScopes(
    domainScopesOrCombined: DomainScopes | string[]
  ): Promise<void> {
    await forEachScope(domainScopesOrCombined, async (domain, scope) => {
      await this.grantScope(domain, scope)
    })
  }

  /**
   * Checks to see whether this token contains the given scope.
   *
   * @param domain - The domain that contains the scope to be checked
   * @param scope - The scope to be checked
   * @returns `true` if the scope is included in this Token; `false` otherwise.
   */
  async hasScope(domain: string, scope: string): Promise<boolean>

  /**
   * Checks to see whether this token contains the given scope. If the scope
   * string contains a `|` character, the string up to the first `|` will be
   * used as the domain under which the scope will be grouped. Otherwise, the
   * default domain of `app` will be used.
   *
   * @param combined - The scope string to be checked, optionally containing a
   * domain in the format `domain|scopeName`
   */
  async hasScope(combined: string): Promise<boolean>
  async hasScope(domainOrCombined: string, scope?: string): Promise<boolean> {
    const parts = scope
      ? { domain: domainOrCombined, key: scope }
      : splitCombined(domainOrCombined)
    const comps = await this.getScopeComponents(parts.domain, parts.key)
    // Use bitwise AND to determine if the byte contains the bit mask
    return comps.byte ? (comps.byte & comps.mask) === comps.mask : false
  }

  /**
   * Checks this token for the given scopes in the DomainScopes map.
   *
   * @param domainScopes - A map of domains to arrays of scopes in that domain
   * to be checked
   * @returns `true` if every scope of every domain exists on this Token;
   * `false` otherwise
   */
  async hasScopes(domainScopes: DomainScopes): Promise<boolean>

  /**
   * Checks this token for the given scopes in the provided array.
   *
   * @param combined - An array of strings in the format `domain|scope`. If the
   * domain portion is missing, the default scope of "app" will be used.
   * @returns `true` if every scope of every domain exists on this Token;
   * `false` otherwise
   */
  async hasScopes(combined: string[]): Promise<boolean>
  async hasScopes(
    domainScopesOrCombined: DomainScopes | string[]
  ): Promise<boolean> {
    let hasAll = true
    await forEachScope(
      domainScopesOrCombined,
      async (domain, scope, breakFn) => {
        const hasScope = await this.hasScope(domain, scope)
        if (!hasScope) {
          hasAll = false
          breakFn()
        }
      }
    )
    return hasAll
  }

  /**
   * Revokes a scope that has been previously granted. This method is idempotent
   * and will not fail when revoking scopes that have not been granted.
   *
   * @param domain - The domain that contains the scope to be revoked
   * @param scope - The name of the scope to be revoked
   */
  async revokeScope(domain: string, scope: string): Promise<void>

  /**
   * Revokes a scope that has been previously granted. This method is idempotent
   * and will not fail when revoking scopes that have not been granted.
   *
   * If the scope string contains a `|` character, the string up to the first
   * `|` will be used as the domain under which the scope will be grouped.
   * Otherwise, the default domain of `app` will be used.
   *
   * @param combined - The scope string to be revoked, optionally containing a
   * domain in the format `domain|scopeName`
   */
  async revokeScope(combined: string): Promise<void>
  async revokeScope(domainOrCombined: string, scope?: string): Promise<void> {
    const parts = scope
      ? { domain: domainOrCombined, key: scope }
      : splitCombined(domainOrCombined)
    const comps = await this.getScopeComponents(parts.domain, parts.key)
    if (comps.byte) {
      // Use bitwise AND with the inverse of the bit mask to unset the scope bit
      comps.blob[comps.offset] = comps.byte & ~comps.mask
      this.domainBlobs[parts.domain] = comps.blob
    }
  }

  /**
   * Revokes a list of scopes that have been previously granted. This method is
   * idempotent and will not fail when revoking scopes that have not been
   * granted.
   *
   * @param domainScopes - A map of domains to arrays of scopes in that domain
   * to be revoked from the token
   */
  async revokeScopes(domainScopes: DomainScopes): Promise<void>

  /**
   * Revokes a list of scopes that have been previously granted. This method is
   * idempotent and will not fail when revoking scopes that have not been
   * granted.
   *
   * @param combined - An array of strings in the format `domain|scope`. If the
   * domain portion is missing, the default scope of "app" will be used.
   */
  async revokeScopes(combined: string[]): Promise<void>
  async revokeScopes(
    domainScopesOrCombined: DomainScopes | string[]
  ): Promise<void> {
    await forEachScope(domainScopesOrCombined, async (domain, scope) => {
      await this.revokeScope(domain, scope)
    })
  }

  /**
   * Sets a domain-specific option on this token. Options are meant for holding
   * non-boolean settings. For boolean values, consider defining a new scope for
   * this domain. All options are stored in the `opt` claim at the top level.
   *
   * @param domain - The domain in which to set the given option
   * @param key - The name of the option to be set
   * @param val - The value for the option
   */
  setOption(domain: string, key: string, val: Serializable): void {
    if (!this.claims.opt) this.claims.opt = {}
    if (!this.claims.opt[domain]) this.claims.opt[domain] = {}
    this.claims.opt[domain][key] = val
  }

  /**
   * Serializes the claims within this Token and signs them cryptographically.
   * The result is an encoded JWT token string.
   *
   * @param kid - An identifier for the key with which to sign this token. The
   * private key or HMAC secret must either exist in the `keys` map passed in
   * the constructor options, or be retrievable by the `getPrivateKey` function
   * provided to the constructor.
   * @param opts - Options to configure the token signing process
   * @returns the signed and encoded token string.
   * @throws {@link Error}
   * Throws if options.subject was not specified, and the 'sub' claim has not
   * been set. A subject is a required claim for a valid JWT.
   */
  async sign(kid: string, opts: TokenSigningOptions = {}): Promise<string> {
    if (!opts.subject && !this.claims.sub) {
      throw new Error('A subject is required to sign this token')
    }
    this.encodeBlobs()
    delete this.claims.exp
    const audience = opts.audience || this.opts.audience
    const issuer = opts.issuer || this.opts.issuer
    const params: jwt.SignOptions = {
      expiresIn: opts.expiresInSecs || this.opts.expiresInSecs,
      noTimestamp: !!opts.noTimestamp,
      header: opts.header || {},
      ...(opts.subject && { subject: opts.subject }),
      ...(audience && { audience }),
      ...(issuer && { issuer })
    }
    params.header['kid'] = kid
    const key = await this.getPrivateKeyDefinition(kid)
    return new Promise((resolve, reject) => {
      params.algorithm = key.algorithm as jwt.Algorithm
      jwt.sign(this.claims, key.privateKey, params, (err, token) => {
        if (err) return reject(err)
        this.token = token
        const decoded = jwt.decode(token, { complete: true })
        this.header = (decoded as Record<string, any>).header
        resolve(token)
      })
    })
  }

  /**
   * Verifies a token's validity by checking its signature, expiration time,
   * and other conditions.
   *
   * @param opts - Options to customize how the token is verified
   * @returns the token's claims when successfully verified.
   * @throws {@link jwt.TokenExpiredError}
   * Thrown when a token has passed the date in its `exp` claim
   * @throws {@link jwt.JsonWebTokenError}
   * Thrown for most verification issues, such as a missing or invalid
   * signature, or mismatched audience or issuer strings
   * @throws {@link jwt.NotBeforeError}
   * Thrown when the date in the `nbf` claim is in the future
   */
  async verify(opts: TokenVerificationOptions = {}): Promise<Claims> {
    if (!this.token) throw new Error('No token string to verify')
    const audience = opts.audience || this.claims.aud || this.opts.audience
    const issuer = opts.issuer || this.claims.iss || this.opts.issuer
    const params: jwt.VerifyOptions = {
      ignoreExpiration: opts.ignoreExpiration || false,
      clockTolerance: opts.clockToleranceSecs || 5,
      ...(opts.maxAgeSecs && { maxAge: `${opts.maxAgeSecs * 1000}` }),
      ...(audience && { audience }),
      ...(issuer && { issuer }),
      ...(opts.nonce && { nonce: opts.nonce }),
      ...(opts.algorithms && { algorithms: opts.algorithms as jwt.Algorithm[] })
    }
    const key =
      opts.key ||
      (await this.getVerificationKey(this.header.kid, this.header.alg))
    return new Promise((resolve, reject) => {
      jwt.verify(this.token, key, params, (err) => {
        if (err) reject(err)
        else resolve(this.claims)
      })
    })
  }

  /**
   * Decodes the `scope` claim into a mapping of domain string to byte array,
   * stored in `this.domainBlobs`.
   */
  private decodeBlobs() {
    if (this.claims.scope) {
      const segments = this.claims.scope.split(/[;:]/)
      for (let i = 0; i < segments.length; i += 2) {
        this.domainBlobs[segments[i]] = base64.toByteArray(segments[i + 1])
      }
    }
  }

  /**
   * Encodes `this.domainBlobs` into a single string in the format
   * `domain1:base64perms1;domain2:base64perms2` (etc) and stores it into the
   * `scope` claim.
   */
  private encodeBlobs(): void {
    const segments = Object.keys(this.domainBlobs).map((domain) => {
      const encodedScopes = base64.fromByteArray(this.domainBlobs[domain])
      return `${domain}:${encodedScopes}`
    })
    this.claims.scope = segments.join(';')
  }

  /**
   * Retrieves a byte array from the set of domain blobs, resizing it if
   * necessary.
   *
   * @param domain - The domain string for which to get the binary scopes blob
   * @param minBytes - The number of bytes the resulting array should have in
   * it, at minimum
   * @returns The byte array for the given domain
   */
  private getBlob(domain: string, minBytes?: number): Uint8Array {
    let blob: Uint8Array = this.domainBlobs[domain]
    if (!blob || blob.length < (minBytes || 0)) {
      const array = Array.from(blob || [])
      while (array.length < (minBytes || 0)) array.push(0)
      blob = Uint8Array.from(array)
    }
    return blob
  }

  /**
   * Retrieves the private key definition for a specified key ID. This function
   * will first attempt to pull the private key (and associated algorithm) from
   * the `keys` object passed to the constructor, and if not found there, will
   * call the `getPrivateKey` function passed to the constructor if one exists.
   * If a private key is found through that method, it will be saved back to the
   * provided `keys` object to avoid calling `getPrivateKey` for the same key ID
   * again.
   *
   * @param kid - The key ID of the private key definition to be retrieved
   * @returns the appropriate private key definition
   * @throws {@link KeyNotFoundError}
   * Thrown if the function expires all avenues by which to locate the
   * referenced private key.
   */
  private async getPrivateKeyDefinition(
    kid: string
  ): Promise<PrivateKeyDefinition> {
    const keys = this.opts.keys
    if (!keys[kid]?.privateKey && this.opts.getPrivateKey) {
      const privKeyDef = await this.opts.getPrivateKey(kid)
      if (!keys[kid]) keys[kid] = privKeyDef
      else keys[kid].privateKey = privKeyDef.privateKey
    }
    if (!keys[kid]?.privateKey) {
      throw new KeyNotFoundError(`Private key "${kid}" could not be found`)
    }
    const { privateKey, algorithm } = keys[kid]
    return { privateKey, algorithm }
  }

  /**
   * Retrieves the public key for a specified key ID. The algorithm is required
   * so that the function knows to look for a private "key" for symmetric
   * signing algorithms, and a public key for asymmetric. If the key not does
   * exist in the `keys` option passed to the constructor, this function will
   * attempt to use `getPublicKey` if it exists, caching the successful result
   * back in the `keys` object for next time.
   *
   * @param kid - The key ID of the key to be retrieved
   * @param algorithm - The algorithm that the key is meant for
   * @returns the specified verification key, in PEM-encoded format for
   * asymmetric public keys or the HMAC secret string.
   * @throws {@link KeyNotFoundError}
   * Thrown if the function expires all avenues by which to locate the
   * referenced key.
   */
  private async getVerificationKey(
    kid: string,
    algorithm: SigningAlgorithm
  ): Promise<string> {
    // Symmetric keys are private. Check for that first
    const isSymmetric = symmetricAlgorithms.includes(algorithm)
    if (isSymmetric) {
      const privDef = await this.getPrivateKeyDefinition(kid)
      return privDef.privateKey
    }
    // Asymmetric keys are public keys. Check that next.
    const keys = this.opts.keys
    if (!keys[kid]?.publicKey && this.opts.getPublicKey) {
      const publicKey = await this.opts.getPublicKey(kid)
      if (!keys[kid]) keys[kid] = { algorithm, publicKey }
      else keys[kid].publicKey = publicKey
    }
    if (!keys[kid]?.publicKey) {
      throw new KeyNotFoundError(`Public key "${kid}" could not be found`)
    }
    return keys[kid].publicKey
  }

  /**
   * Gets the binary components of an individual scope, targeting the bit
   * that can be read or changed to interact with the encoded scope.
   *
   * @param domain - The domain containing the target scope
   * @param scope - The name of the scope for which to retrieve the components
   * @param resize - `true` to resize the resulting blob to fit the chosen scope
   * bit; `false` to return it in the currently stored size
   * @returns The components of the given scope
   */
  async getScopeComponents(
    domain: string,
    scope: string,
    resize = false
  ): Promise<ScopeComponents> {
    const comps: Partial<ScopeComponents> = {}
    const idx = await this.getScopeIndex(domain, scope)
    comps.idx = idx
    comps.offset = Math.floor(idx / 8)
    comps.blob = this.getBlob(domain, resize ? comps.offset + 1 : 0)
    comps.byte = comps.blob[comps.offset]
    comps.mask = Math.pow(2, idx % 8)
    return comps as ScopeComponents
  }

  /**
   * Gets the index of the specified scope from the domainScopes map. If it's
   * not found, this method attempts to refresh that map with the refreshScopes
   * method before throwing a ScopeNotFoundError.
   *
   * @param domain - The domain containing the target scope
   * @param scope - The name of the target scope
   * @param noRetry - `true` to not attempt to refresh the domainScopes map and
   * retry this function; `false` to throw {@link ScopeNotFoundError}
   * immediately when a scope doesn't exist in domainScopes.
   * @returns the index of the target permission
   * @throws {@link ScopeNotFoundError}
   * Thrown if the given scope does not exist in the domainScopes object and
   * did not appear when refreshing the domainScopes.
   */
  async getScopeIndex(
    domain: string,
    scope: string,
    noRetry = false
  ): Promise<number> {
    const map = this.opts.domainScopes[domain] || {}
    if (!(scope in map)) {
      const updateAfter = this.scopesLastUpdate + this.opts.refreshScopesAfterMs
      if (noRetry || !this.opts.refreshScopes || Date.now() < updateAfter) {
        throw new ScopeNotFoundError(`Scope does not exist: ${domain}|${scope}`)
      }
      const domainScopes = await this.opts.refreshScopes()
      this.scopesLastUpdate = Date.now()
      Object.assign(this.opts.domainScopes, domainScopes)
      return this.getScopeIndex(domain, scope, true)
    }
    return map[scope]
  }
}
