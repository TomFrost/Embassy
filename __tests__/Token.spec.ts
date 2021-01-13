/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

import {
  JsonWebTokenError,
  KeyNotFoundError,
  ScopeNotFoundError,
  Token,
  TokenOptions,
  TokenExpiredError,
  TokenParseError
} from '../src'
import { pub, priv } from './fixtures/keys'
import delay from 'delay'

const testTokenStr =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6Imdvb2RLZXkifQ.eyJhdWQiOiJ0ZX' +
  'N0LWF1ZGllbmNlIiwiaXNzIjoidGVzdC1pc3N1ZXIiLCJzdWIiOiJiYXIiLCJwcm0iOiIiLCJ' +
  'pYXQiOjE0NjM4ODk0ODYsImV4cCI6MTQ2Mzg4OTQ5MX0.W6Ulky7iGnCp9OGtbVzm_Bdz-FOO' +
  'dL_2UFuaixsPE8FBQxtByG4nBNrUOcaT6_qJ7_tHZNqFfICQM24NzqxxgQ'

const domainScopes = {
  foo: { bar: 0, baz: 1 },
  app: { bap: 0 }
}
const tokenOpts: TokenOptions = {
  domainScopes,
  keys: {
    goodKey: { publicKey: pub, privateKey: priv, algorithm: 'ES256' },
    privAlgo: { privateKey: priv, algorithm: 'ES256' },
    corruptKey: {
      publicKey: pub,
      privateKey: priv.replace(/M/g, '@'),
      algorithm: 'ES256'
    },
    hmac: {
      privateKey: 'secret',
      algorithm: 'HS256'
    }
  }
}
let inst: Token

describe('Token', () => {
  beforeEach(() => {
    inst = new Token(tokenOpts)
  })
  describe('constructor', () => {
    it('instantiates an empty token', () => {
      inst = new Token()
      expect(inst).toBeInstanceOf(Token)
    })
    it('instantiates a token with claims', () => {
      inst = new Token({ claims: { email: 'foo@bar.com' } })
      expect(inst.claims).toEqual(
        expect.objectContaining({ email: 'foo@bar.com' })
      )
    })
    it('instantiates a token from a token string', () => {
      inst = new Token({ token: testTokenStr })
      expect(inst.claims).toEqual(
        expect.objectContaining({ iss: 'test-issuer' })
      )
    })
    it('throws a TokenParseError if a bad token is passed in', () => {
      const getInst = (opts: TokenOptions) => () => new Token(opts)
      expect(getInst({ token: 'foo' })).toThrowError(TokenParseError)
    })
  })
  describe('options', () => {
    it('returns undefined for unset options', () => {
      expect(inst.getOption('lead', 'foo')).toBeUndefined()
    })
    it('sets and retrieves options', () => {
      inst.setOption('lead', 'foo', 5)
      inst.setOption('lead', 'bar', 'baz')
      expect(inst.getOption('lead', 'foo')).toEqual(5)
      expect(inst.getOption('lead', 'bar')).toEqual('baz')
    })
  })
  describe('scopes', () => {
    it('denies scope on nonexistent scope byte', async () => {
      await expect(inst.hasScope('foo', 'bar')).resolves.toBe(false)
    })
    it('denies scope on existing scope byte with unset bit', async () => {
      await inst.grantScope('foo', 'baz')
      await expect(inst.hasScope('foo', 'bar')).resolves.toBe(false)
    })
    it('has scope after successful grant', async () => {
      await inst.grantScope('foo', 'bar')
      await expect(inst.hasScope('foo', 'bar')).resolves.toBe(true)
    })
    it('denies scope after a revoke', async () => {
      await inst.grantScope('foo', 'bar')
      await inst.revokeScope('foo', 'bar')
      await expect(inst.hasScope('foo', 'bar')).resolves.toBe(false)
    })
    it('has no effect when revoking an unset scope', async () => {
      await inst.revokeScope('foo', 'bar')
      await expect(inst.hasScope('foo', 'bar')).resolves.toBe(false)
    })
    it('grants and checks multiple scopes', async () => {
      const map = { foo: ['bar', 'baz'] }
      await inst.grantScopes(map)
      await expect(inst.hasScopes(map)).resolves.toBe(true)
    })
    it('grants and revokes multiple scopes', async () => {
      const map = { foo: ['bar', 'baz'] }
      await inst.grantScopes(map)
      await inst.revokeScopes(map)
      await expect(inst.hasScopes(map)).resolves.toBe(false)
    })
    it('fails to grant unknown scopes in a known domain', async () => {
      await expect(inst.grantScope('foo', 'foo')).rejects.toThrowError(
        ScopeNotFoundError
      )
    })
    it('fails to grant scopes for unknown domains', async () => {
      await expect(inst.grantScope('bar', 'bar')).rejects.toThrowError(
        ScopeNotFoundError
      )
    })
    it('calls a function to refresh scopes via promise on grant', async () => {
      const refreshScopes = jest.fn().mockResolvedValue(domainScopes)
      inst = new Token({ refreshScopes })
      await inst.grantScope('foo', 'bar')
      expect(refreshScopes).toBeCalled()
    })
    it('calls a function to refresh scopes on grant', async () => {
      const refreshScopes = jest.fn().mockResolvedValue(domainScopes)
      inst = new Token({ refreshScopes })
      await inst.grantScope('foo', 'bar')
      expect(refreshScopes).toBeCalled()
    })
    it('calls a function to refresh scopes on revoke', async () => {
      const refreshScopes = jest.fn().mockResolvedValue(domainScopes)
      inst = new Token({ refreshScopes })
      await inst.revokeScope('foo', 'bar')
      expect(refreshScopes).toBeCalled()
    })
    it('calls a function to refresh scopes via promise on check', async () => {
      const refreshScopes = jest.fn().mockResolvedValue(domainScopes)
      inst = new Token({ refreshScopes })
      await inst.hasScope('foo', 'bar')
      expect(refreshScopes).toBeCalled()
    })
    it('stores results of last scope refresh for future calls', async () => {
      const refreshScopes = jest.fn().mockResolvedValue(domainScopes)
      inst = new Token({ refreshScopes })
      await inst.hasScope('foo', 'bar')
      expect(refreshScopes).toBeCalledTimes(1)
      await inst.hasScope('foo', 'baz')
      expect(refreshScopes).toBeCalledTimes(1)
    })
    it('does not refresh scopes within refreshScopesAfterMs', async () => {
      let calls = 0
      const refreshScopes = () => {
        if (!calls++) return domainScopes
        return { bar: { baz: 2 } }
      }
      inst = new Token({ refreshScopes })
      await inst.hasScope('foo', 'bar')
      await expect(inst.hasScope('bar', 'baz')).rejects.toThrowError(
        ScopeNotFoundError
      )
    })
    it('refreshes scopes outside of refreshScopesAfterMs', async () => {
      let calls = 0
      const refreshScopes = () => {
        if (!calls++) return domainScopes
        return { bar: { baz: 2 } }
      }
      inst = new Token({ refreshScopes, refreshScopesAfterMs: 10 })
      await inst.hasScope('foo', 'bar')
      await delay(11)
      await expect(inst.hasScope('bar', 'baz')).resolves.toBe(false)
    })
    it('grants, checks, and revokes scopes in combined format', async () => {
      const scopes = ['foo|bar', 'foo|baz', 'bap']
      await inst.grantScopes(scopes)
      await expect(inst.hasScopes(scopes)).resolves.toBe(true)
      await inst.revokeScopes(scopes)
      await expect(inst.hasScopes(scopes)).resolves.toBe(false)
    })
    it('can detect a revoked scope in combined format', async () => {
      const scopes = ['foo|bar', 'foo|baz', 'bap']
      await inst.grantScopes(scopes)
      await inst.revokeScope('foo|baz')
      await expect(inst.hasScopes(scopes)).resolves.toBe(false)
    })
    it('grants and checks a single scope in combined format', async () => {
      await inst.grantScope('foo|bar')
      await expect(inst.hasScope('foo|bar')).resolves.toBe(true)
    })
  })
  describe('sign', () => {
    it('signs a token', async () => {
      const signed = await inst.sign('goodKey', { subject: 'foo' })
      expect(typeof signed).toBe('string')
      expect(signed.split('.')).toHaveLength(3)
    })
    it('encodes scopes when signing', async () => {
      await inst.grantScope('foo', 'bar')
      const signed = await inst.sign('goodKey', { subject: 'foo' })
      inst = new Token({ ...tokenOpts, token: signed })
      await expect(inst.hasScope('foo', 'bar')).resolves.toBe(true)
    })
    it('supports options without scopes', async () => {
      inst.setOption('foo', 'bar', 'baz')
      const signed = await inst.sign('goodKey', { subject: 'foo' })
      inst = new Token({ token: signed })
      expect(inst.getOption('foo', 'bar')).toEqual('baz')
    })
    it('assigns the given expiration', async () => {
      const signed = await inst.sign('goodKey', {
        subject: 'foo',
        expiresInSecs: 60
      })
      inst = new Token({ token: signed })
      const expiredAt = Math.floor(Date.now() / 1000) + 61
      expect(inst.claims.exp).toBeLessThan(expiredAt)
    })
    it('allows the subject to exist in a claim only', async () => {
      inst.claims.sub = 'foo@bar.baz'
      await expect(inst.sign('goodKey')).resolves.toBeDefined()
    })
    it('throws when there is no subject', async () => {
      const throws = () => inst.sign('goodKey')
      await expect(throws).rejects.toThrowError(/subject is required/)
    })
    it('throws when the key ID is not in the key map', async () => {
      await expect(inst.sign('noKey', { subject: 'foo' })).rejects.toThrow(
        KeyNotFoundError
      )
    })
    it('throws when the key has no priv property', async () => {
      await expect(inst.sign('emptyKey', { subject: 'foo' })).rejects.toThrow(
        KeyNotFoundError
      )
    })
    it('throws when the key has no algo property', async () => {
      await expect(inst.sign('privOnly', { subject: 'foo' })).rejects.toThrow(
        KeyNotFoundError
      )
    })
    it('rejects if the key is corrupt', async () => {
      await expect(
        inst.sign('corruptKey', { subject: 'foo' })
      ).rejects.toThrowError()
    })
    it('calls getPrivateKey when the private key is not found', async () => {
      inst = new Token({
        getPrivateKey: (kid) => {
          const { privateKey, algorithm } = tokenOpts.keys[kid]
          return { privateKey, algorithm }
        }
      })
      const signed = await inst.sign('privAlgo', { subject: 'foo' })
      expect(signed).toBeDefined()
    })
    it('calls getPrivateKey when only a pub key is present', async () => {
      inst = new Token({
        getPrivateKey: (kid) => {
          const { privateKey, algorithm } = tokenOpts.keys[kid]
          return { privateKey, algorithm }
        },
        keys: { privAlgo: { publicKey: 'PEM', algorithm: 'RS512' } }
      })
      const signed = await inst.sign('privAlgo', { subject: 'foo' })
      expect(signed).toBeDefined()
    })
    it('supports promises from getPrivateKey', async () => {
      inst = new Token({
        getPrivateKey: async (kid) => {
          const { privateKey, algorithm } = tokenOpts.keys[kid]
          return { privateKey, algorithm }
        }
      })
      const signed = await inst.sign('privAlgo', { subject: 'foo' })
      expect(signed).toBeDefined()
    })
    it('caches the results of getPrivateKey', async () => {
      const getPrivateKey = jest.fn(async (kid) => {
        const { privateKey, algorithm } = tokenOpts.keys[kid]
        return { privateKey, algorithm }
      })
      inst = new Token({ getPrivateKey })
      await inst.sign('privAlgo', { subject: 'foo' })
      expect(getPrivateKey).toBeCalledTimes(1)
      await inst.sign('privAlgo', { subject: 'foo' })
      expect(getPrivateKey).toBeCalledTimes(1)
    })
    it('supports signing when an exp claim is already set', async () => {
      const now = Math.floor(Date.now() / 1000)
      inst.claims.exp = now
      const signed = await inst.sign('privAlgo', { subject: 'foo' })
      inst = new Token({ token: signed })
      expect(inst.claims.exp).toEqual(now + 3600)
    })
    it('includes audience and issuer in signing opts', async () => {
      const token = await inst.sign('privAlgo', {
        subject: 'foo',
        audience: 'bar',
        issuer: 'baz'
      })
      inst = new Token({ token })
      expect(inst.claims).toEqual(
        expect.objectContaining({
          sub: 'foo',
          aud: 'bar',
          iss: 'baz'
        })
      )
    })
    it('includes audience and issuer in token opts', async () => {
      inst = new Token({
        ...tokenOpts,
        audience: 'bar',
        issuer: 'baz'
      })
      const token = await inst.sign('privAlgo', { subject: 'foo' })
      inst = new Token({ token })
      expect(inst.claims).toEqual(
        expect.objectContaining({
          sub: 'foo',
          aud: 'bar',
          iss: 'baz'
        })
      )
    })
  })
  describe('verify', () => {
    it('verifies a token using KID in the same instance', async () => {
      await inst.sign('goodKey', { subject: 'foo' })
      await expect(inst.verify()).resolves.toBeTruthy()
    })
    it('verifies a token using a provided key', async () => {
      await inst.sign('goodKey', { subject: 'foo' })
      await expect(inst.verify({ key: pub })).resolves.toBeTruthy()
    })
    it('verifies a token passed to the constructor', async () => {
      inst = new Token(Object.assign({ token: testTokenStr }, tokenOpts))
      await expect(
        inst.verify({ ignoreExpiration: true })
      ).resolves.toBeTruthy()
    })
    it('fails to verify an unsigned token', async () => {
      await expect(inst.verify()).rejects.toThrow(/No token string to verify/)
    })
    it('fails validation using maxAgeSecs', async () => {
      inst = new Token(Object.assign({ token: testTokenStr }, tokenOpts))
      await expect(
        inst.verify({ ignoreExpiration: true, maxAgeSecs: 10 })
      ).rejects.toThrowError(TokenExpiredError)
    })
    it('calls function to get pub key via Promise', async () => {
      const getPublicKey = jest.fn().mockResolvedValue(pub)
      const signed = await inst.sign('goodKey', { subject: 'foo' })
      inst = new Token({ token: signed, getPublicKey })
      await expect(inst.verify()).resolves.toBeTruthy()
      expect(getPublicKey).toBeCalledTimes(1)
      expect(getPublicKey).toBeCalledWith('goodKey')
    })
    it('calls function to get pub key synchronously', async () => {
      const getPublicKey = jest.fn().mockReturnValue(pub)
      const signed = await inst.sign('goodKey', { subject: 'foo' })
      inst = new Token({ token: signed, getPublicKey })
      await expect(inst.verify()).resolves.toBeTruthy()
      expect(getPublicKey).toBeCalledTimes(1)
      expect(getPublicKey).toBeCalledWith('goodKey')
    })
    it('gets public key when private key already exists', async () => {
      const getPublicKey = jest.fn().mockResolvedValue(pub)
      const token = await inst.sign('privAlgo', { subject: 'foo' })
      inst = new Token({ ...tokenOpts, token, getPublicKey })
      await expect(inst.verify()).resolves.toBeTruthy()
    })
    it('throws KeyNotFoundError when no pub key exists', async () => {
      const token = await inst.sign('goodKey', { subject: 'foo' })
      inst = new Token({ token })
      await expect(inst.verify()).rejects.toThrow(KeyNotFoundError)
    })
    it('verifies a token signed with an HMAC key', async () => {
      const token = await inst.sign('hmac', { subject: 'foo' })
      inst = new Token({ ...tokenOpts, token })
      await expect(inst.verify()).resolves.toBeTruthy()
    })
    it('verifies a matching nonce claim', async () => {
      inst.claims.nonce = 'foo'
      const token = await inst.sign('hmac', { subject: 'foo' })
      inst = new Token({ ...tokenOpts, token })
      await expect(inst.verify({ nonce: 'foo' })).resolves.toBeTruthy()
    })
    it('fails a non-matching nonce claim', async () => {
      inst.claims.nonce = 'foo'
      const token = await inst.sign('hmac', { subject: 'foo' })
      inst = new Token({ ...tokenOpts, token })
      await expect(inst.verify({ nonce: 'bar' })).rejects.toThrow(
        JsonWebTokenError
      )
    })
    it('verifies a restricted set of algorithms', async () => {
      const token = await inst.sign('hmac', { subject: 'foo' })
      inst = new Token({ ...tokenOpts, token })
      await expect(inst.verify({ algorithms: ['HS256'] })).resolves.toBeTruthy()
    })
    it('fails a restricted set of algorithms', async () => {
      const token = await inst.sign('hmac', { subject: 'foo' })
      inst = new Token({ ...tokenOpts, token })
      await expect(inst.verify({ algorithms: ['RS256'] })).rejects.toThrow(
        JsonWebTokenError
      )
    })
  })
})
