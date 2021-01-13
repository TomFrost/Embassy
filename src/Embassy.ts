/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

import { Token } from './Token'
import { EmbassyOptions, ManualClaims, TokenOptions } from './types'

export class Embassy {
  private tokenOptions: TokenOptions = {}

  /**
   * Creates a new Embassy instance.
   *
   * @param opts - Options with which to initialize every new {@link Token}.
   */
  constructor(opts: EmbassyOptions = {}) {
    this.tokenOptions = { domainScopes: {}, keys: {}, ...opts }
  }

  /**
   * Creates a new Token, optionally initializing it with a set of claims.
   *
   * @param claims - A mapping of JWT claim keys to appropriate values
   * @returns The newly created Token
   */
  createToken(claims?: ManualClaims): Token {
    return new Token({ ...this.tokenOptions, claims })
  }

  /**
   * Creates a Token object from a signed JWT string.
   *
   * @param token - The JWT to be parsed
   * @returns A token object, initiated with the data contained in the token
   * string
   */
  parseToken(token: string): Token {
    return new Token({ ...this.tokenOptions, token })
  }
}
