/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

import { Embassy, Token } from '../src'
import { priv, pub } from './fixtures/keys'

const testTokenStr =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6Imdvb2RLZXkifQ.eyJhdWQiOiJ0ZX' +
  'N0LWF1ZGllbmNlIiwiaXNzIjoidGVzdC1pc3N1ZXIiLCJzdWIiOiJiYXIiLCJwcm0iOiIiLCJ' +
  'pYXQiOjE0NjM4ODk0ODYsImV4cCI6MTQ2Mzg4OTQ5MX0.W6Ulky7iGnCp9OGtbVzm_Bdz-FOO' +
  'dL_2UFuaixsPE8FBQxtByG4nBNrUOcaT6_qJ7_tHZNqFfICQM24NzqxxgQ'

let inst: Embassy

describe('Embassy', () => {
  beforeEach(() => {
    inst = new Embassy()
  })
  describe('constructor', () => {
    it('creates a new Embassy', () => {
      expect(inst instanceof Embassy).toBeTruthy()
    })
  })
  describe('createToken', () => {
    it('creates a blank Token object', () => {
      const token = inst.createToken()
      expect(token).toBeInstanceOf(Token)
    })
    it('creates a token with initial claims', () => {
      const token = inst.createToken({ sub: 'foo' })
      expect(token.claims).toEqual(expect.objectContaining({ sub: 'foo' }))
    })
    it('persists domainScopes maps to new Tokens', async () => {
      const refreshScopes = jest.fn().mockResolvedValue({ foo: { bar: 0 } })
      inst = new Embassy({ refreshScopes })
      const token1 = inst.createToken()
      await token1.grantScope('foo', 'bar')
      expect(refreshScopes).toBeCalledTimes(1)
      const token2 = inst.createToken()
      await token2.grantScope('foo', 'bar')
      expect(refreshScopes).toBeCalledTimes(1)
    })
    it('persists public keys to new Tokens', async () => {
      const getPubKey = jest.fn().mockResolvedValue(pub)
      inst = new Embassy({
        getPubKey,
        keys: {
          goodKey: { privateKey: priv, algorithm: 'ES256' }
        }
      })
      const token1 = inst.createToken({ sub: 'foo' })
      const token1Str = await token1.sign('goodKey')
      await token1.verify()
      expect(getPubKey).toBeCalledTimes(1)
      const token2 = inst.parseToken(token1Str)
      await token2.verify()
      expect(getPubKey).toBeCalledTimes(1)
    })
  })
  describe('parseToken', () => {
    it('parses a token string into a Token object', () => {
      const token = inst.parseToken(testTokenStr)
      expect(token).toBeInstanceOf(Token)
    })
  })
})
