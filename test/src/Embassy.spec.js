/*
 * Embassy
 * Copyright (c) 2017 Tom Shawver LLC
 */

/* globals describe, it, beforeEach, afterEach, before, after, should */
'use strict'

const Embassy = require('src/Embassy')
const keys = require('../keys')

const testTokenStr = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6Imdvb2RLZXkifQ.eyJhdWQiOiJ0ZXN0LWF1ZGllbmNlIiwiaXN' +
  'zIjoidGVzdC1pc3N1ZXIiLCJzdWIiOiJiYXIiLCJwcm0iOiIiLCJpYXQiOjE0NjM4ODk0ODYsImV4cCI6MTQ2Mzg4OTQ5MX0.W6Ulky7iGnCp9OGt' +
  'bVzm_Bdz-FOOdL_2UFuaixsPE8FBQxtByG4nBNrUOcaT6_qJ7_tHZNqFfICQM24NzqxxgQ'
let inst

describe('Embassy', () => {
  beforeEach(() => {
    inst = new Embassy()
  })
  describe('constructor', () => {
    it('creates a new Embassy', () => {
      inst.should.be.instanceOf(Embassy)
    })
    it('exposes Token and the errors', () => {
      Embassy.should.have.keys(['Token', 'KeyNotFoundError', 'PermissionNotFoundError', 'TokenParseError'])
    })
  })
  describe('token creation', () => {
    it('creates a blank Token object', () => {
      inst.createToken().should.be.instanceOf(Embassy.Token)
    })
    it('creates a token with initial claims', () => {
      const token = inst.createToken({ sub: 'foo' })
      token.getClaim('sub').should.equal('foo')
    })
  })
  describe('token parsing', () => {
    it('should parse a token string into a Token object', () => {
      inst.parseToken(testTokenStr).should.be.instanceOf(Embassy.Token)
    })
  })
  describe('configuration persistence', () => {
    it('should persist domainPermissions maps to new Tokens', () => {
      let calls = 0
      const refreshPermissions = () => {
        calls++
        return { foo: { bar: 0 } }
      }
      inst = new Embassy({ refreshPermissions })
      let token = inst.createToken()
      return token.grantPermission('foo', 'bar').then(() => {
        calls.should.equal(1)
        token = inst.createToken()
        return token.grantPermission('foo', 'bar')
      }).then(() => {
        calls.should.equal(1)
      })
    })
    it('should persist public keys to new Tokens', () => {
      let calls = 0
      const getPubKey = () => {
        calls++
        return keys.pub
      }
      inst = new Embassy({
        getPubKey,
        keys: {
          goodKey: { priv: keys.priv, algo: 'ES256' }
        }
      })
      let token = inst.createToken({ sub: 'foo' })
      let str
      return token.sign('goodKey').then(tokenStr => {
        str = tokenStr
        return token.verify()
      }).then(() => {
        calls.should.equal(1)
        token = inst.parseToken(str)
        return token.verify()
      }).then(() => {
        calls.should.equal(1)
      })
    })
  })
})
