/*
 * Embassy
 * Copyright (c) 2017-2018 Tom Shawver
 */

'use strict'

const Token = require('./Token')
const KeyNotFoundError = require('./errors/KeyNotFoundError')
const PermissionNotFoundError = require('./errors/PermissionNotFoundError')
const TokenParseError = require('./errors/TokenParseError')

class Embassy {
  /**
   * Creates a new Embassy instance.
   * @param {Object} [opts] An object mapping of configuration objects. For all available options, see
   * {@link Token#constructor}.
   */
  constructor (opts) {
    const optDefaults = {
      keys: {},
      domainPermissions: {}
    }
    this._opts = Object.assign({}, optDefaults, opts || {})
  }

  /**
   * Creates a new Token, optionally initializing it with a set of claims.
   * @param {Object} [claims] A mapping of JWT claim keys to appropriate values
   * @returns {Token} The newly created token object
   */
  createToken (claims) {
    return new Token(Object.assign({}, this._opts, { claims }))
  }

  /**
   * Creates a Token object from a signed, base64-format token string.
   * @param {string} [token] The encoded token string
   * @returns {Token} A token object, initiated with the data contained in the token string
   */
  parseToken (token) {
    return new Token(Object.assign({}, this._opts, { token }))
  }
}

module.exports = Embassy
module.exports.Token = Token
module.exports.KeyNotFoundError = KeyNotFoundError
module.exports.PermissionNotFoundError = PermissionNotFoundError
module.exports.TokenParseError = TokenParseError
