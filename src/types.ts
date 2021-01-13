/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

export { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

export const asymmetricAlgorithms: Readonly<string[]> = [
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512',
  'ES256',
  'ES384',
  'ES512'
]

export const symmetricAlgorithms: Readonly<string[]> = [
  'HS256',
  'HS384',
  'HS512'
]

export type Serializable = string | number | boolean | null

export type ClaimValue = Serializable | Record<string, Serializable>

export type DomainScopes = {
  [domain: string]: string[]
}

export type DomainScopeMap = {
  [domain: string]: {
    [scope: string]: number
  }
}

export type DomainKey = {
  domain: string
  key: string
}

export interface ScopeComponents {
  /** The scope's index, from the domainScopes map */
  idx: number
  /** The index of the byte inside the blob that contains this scope's bit */
  offset: number
  /** The full array of bytes defining this domain's scope blob */
  blob: Uint8Array
  /** The individual target byte of the blob (same as `blob[offset]`) */
  byte: number
  /** The bit mask targeting the individual scope bit in the provided byte */
  mask: number
}

export type AsymmetricAlgorithm = typeof asymmetricAlgorithms[number]

export type SymmetricAlgorithm = typeof symmetricAlgorithms[number]

export type SigningAlgorithm = SymmetricAlgorithm | AsymmetricAlgorithm

export type PrivateKeyDefinition = {
  privateKey: string
  algorithm: SigningAlgorithm
}

export type KeyDefinition =
  | {
      algorithm: SigningAlgorithm
      privateKey: string
      publicKey?: string
    }
  | {
      algorithm: AsymmetricAlgorithm
      privateKey?: string
      publicKey: string
    }

/**
 * A function to be called iteratively for multiple domain/scope pairs.
 *
 * @param domain - The domain of a scope
 * @param scope - The scope string
 * @param breakFn - A function to be called to prevent the loop from continuing
 */
export type ScopeLoopFunction = (
  domain: string,
  scope: string,
  breakFn: () => void
) => void | Promise<void>

export interface ManualClaims {
  sub?: string
  iss?: string
  aud?: string
  scope?: string
  [key: string]: ClaimValue | Record<string, ClaimValue>
}

export interface Claims extends ManualClaims {
  iat?: number
  exp?: number
  nbf?: number
  jti?: string
}

export interface JWTHeader {
  alg: SigningAlgorithm
  typ: 'JWT'
  kid?: string
  [custom: string]: Serializable
}

export interface CommonClaimsOptions {
  /**
   * The audience string with which to sign and verify tokens by default.
   */
  audience?: string
  /**
   * The issuer string with which to sign and verify tokens by default.
   */
  issuer?: string
}

export interface ExpiringClaimsOptions extends CommonClaimsOptions {
  /**
   * The number of seconds after which a newly signed token should expire, by
   * default.
   *
   * @defaultValue 3600
   */
  expiresInSecs?: number
}

export interface EmbassyOptions extends ExpiringClaimsOptions {
  /**
   * A mapping of domain to maps of scopes to their index under that name. For
   * example, if the "users" domain has "editSelf" and "editAll" scopes, the
   * domainScopes might appear as
   *
   * ```
   * {
   *   users: {
   *     editSelf: 0,
   *     editAll: 1
   *   }
   * }
   * ```
   *
   * The index of each scope within a domain should start at 0 and increment by
   * 1 with every new scope, never repeating a number.
   *
   * @remarks
   * Once an index has been set, it should never be changed as currently issued
   * and valid tokens refer to their scopes by index number. This format is used
   * so that scopes that become inapplicable after time can be deleted without
   * shifting the indexes of scopes that come after them.
   */
  domainScopes?: DomainScopeMap
  /**
   * A mapping of key IDs to KeyDefinitions to check initially before any calls
   * to find external keys are made.
   *
   * @remarks
   * **IMPORTANT NOTE:** This object will be mutated in order to cache keys for
   * future token signing and verification. If it's important that the original
   * object remain unmodified, clone it before passing it in.
   */
  keys?: Record<string, KeyDefinition>
  /**
   * A function to update (or retrieve for the first time) the domainScopes map.
   * When a scope is requested that does not exist in the currently known map,
   * this function will be called to update the map and look for the scope
   * before giving up and throwing an Error. Must return, or resolve to, a new
   * `DomainScopeMap`.
   */
  refreshScopes?: () => DomainScopeMap | Promise<DomainScopeMap>
  /**
   * The number of milliseconds that must pass before the scopes can be
   * refreshed again. If `refreshScopes` is called and a new, unknown scope
   * is encountered within this amount of time from that call, an Error will be
   * thrown rather than refreshing the scopes.
   *
   * @defaultValue 1000
   */
  refreshScopesAfterMs?: number
  /**
   * A function to be called when attempting to use a currently-unknown key ID
   * to either:
   *
   * - Sign a Token
   * - Verify a Token that was signed using a shared-secret symmetric algorithm
   *   in the HMAC family
   *
   * The function takes a key ID and should return or resolve to a
   * `PrivateKeyDefinition` with the `algorithm` of the key, and a `privateKey`
   * property with either the PEM-formatted asymmetric key or shared secret.
   *
   * @param kid - The ID of the key to be retrieved
   * @returns A private key definition for the supplied `kid`, or a promise that
   * resolves to one.
   */
  getPrivKey?: (
    kid: string
  ) => PrivateKeyDefinition | Promise<PrivateKeyDefinition>
  /**
   * A function to be called when attempting to verify a token that was
   * signed with a currently-unknown key ID using an asymmetric algorithm. It
   * takes the key ID as its only argument, and must return a PEM-formatted
   * public key.
   *
   * @remarks
   * When verifying a token signed with HMAC, `getPrivKey` is used since
   * symmetric keys should never be considered "public". This distinction is
   * made automatically based on the algorithm header of the token being
   * verified.
   *
   * @param kid - The ID of the key to be retrieved
   * @returns The PEM-encoded public key associated with the supplied `kid`.
   */
  getPubKey?: (kid: string) => string | Promise<string>
}

export interface TokenOptions extends EmbassyOptions {
  /** A mapping of default claims to add to each new JWT, unless overridden. */
  claims?: ManualClaims
  /** A token string to be decoded and parsed to initialize this Token */
  token?: string
}

export interface TokenSigningOptions extends ExpiringClaimsOptions {
  /**
   * The ID of the intended user of this token. Optional only if a 'sub' claim
   * has already been set.
   */
  subject?: string
  /**
   * If true, this method will not generate an 'iat' (Issued At) claim.
   *
   * @defaultValue false
   */
  noTimestamp?: boolean
  /** Additional header properties to set. Avoid for most use cases. */
  header?: Partial<JWTHeader>
}

export interface TokenVerificationOptions extends CommonClaimsOptions {
  /**
   * List of strings with the names of the allowed algorithms. Allows all
   * algorithms if omitted.
   *
   * @example
   * ```typescript
   * ["HS256", "HS384"]
   * ```
   */
  algorithms?: SigningAlgorithm[]
  /**
   * `true` to allow expired tokens to pass verification checks, `false`
   * otherwise
   */
  ignoreExpiration?: boolean
  /**
   * If specified, will fail verification if the token is older than the
   * specified number of seconds
   */
  maxAgeSecs?: number
  /**
   * The seconds of buffer to allow for differences between machine times when
   * verifying the token.
   *
   * @defaultValue 5
   */
  clockToleranceSecs?: number
  /**
   * A nonce to be verified against the `nonce` claim. Useful for Open ID's ID
   * tokens.
   */
  nonce?: string
  /**
   * The key to use to verify the token's signature. If omitted, Embassy will
   * look in the `keys` property passed to the constructor, or execute
   * `getPrivKey` (for symmetric algorithms) or `getPubKey` (for asymmetric)
   * if it's not found in `keys`.
   */
  key?: string
}
