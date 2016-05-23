/*
 * Embassy
 * Copyright (c) 2016, TechnologyAdvice LLC
 */

'use strict'

const Token = require('src/Token')
const TokenParseError = require('src/errors/TokenParseError')
const KeyNotFoundError = require('src/errors/KeyNotFoundError')
const path = require('path')
const fs = require('fs')

/* globals describe, it, beforeEach, afterEach, before, after, should */
const privKey = fs.readFileSync(path.resolve('test/keys/test.priv.pem'))
const pubKey = fs.readFileSync(path.resolve('test/keys/test.pub.pem'))
const testTokenStr = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6Imdvb2RLZXkifQ.eyJhdWQiOiJ0ZXN0LWF1ZGllbmNlIiwiaXNzIjoidGVzdC1pc3N1ZXIiLCJzdWIiOiJiYXIiLCJwcm0iOiIiLCJpYXQiOjE0NjM4ODk0ODYsImV4cCI6MTQ2Mzg4OTQ5MX0.W6Ulky7iGnCp9OGtbVzm_Bdz-FOOdL_2UFuaixsPE8FBQxtByG4nBNrUOcaT6_qJ7_tHZNqFfICQM24NzqxxgQ'
const tokenOpts = {
  domainPermissions: {
    foo: { bar: 0, baz: 1 }
  },
  keys: {
    goodKey: { pub: pubKey, priv: privKey, algo: 'ES256' },
    emptyKey: { },
    privOnly: { priv: privKey },
    privAlgo: { priv: privKey, algo: 'ES256' },
    corruptKey: { pub: pubKey, priv: privKey.toString().replace(/M/g, '@'), algo: 'ES256' }
  }
}
let inst

describe('Token', () => {
  beforeEach(() => {
    inst = new Token(tokenOpts)
  })
  describe('constructor', () => {
    it('instantiates an empty token', () => {
      inst = new Token()
      inst.should.be.instanceOf(Token)
    })
    it('instantiates a token with claims', () => {
      inst = new Token({claims: {email: 'foo@bar.com'}})
      inst.getClaim('email').should.equal('foo@bar.com')
    })
    it('instantiates a token from a token string', () => {
      inst = new Token({token: testTokenStr})
      inst.getClaim('iss').should.equal('test-issuer')
    })
    it('throws a TokenParseError if a bad token is passed in', () => {
      const getInst = (opts) => () => new Token(opts)
      getInst({token: 'foo'}).should.throw(TokenParseError)
    })
  })
  describe('claims', () => {
    it('returns undefined for unset claims', () => {
      should.not.exist(inst.getClaim('foo'))
    })
    it('sets and retrieves a claim', () => {
      inst.setClaim('foo', 'bar')
      inst.getClaim('foo').should.equal('bar')
    })
  })
  describe('options', () => {
    it('returns undefined for unset options', () => {
      should.not.exist(inst.getOption('lead', 'foo'))
    })
    it('sets and retrieves options', () => {
      inst.setOption('lead', 'foo', 5)
      inst.setOption('lead', 'bar', 'baz')
      inst.getOption('lead', 'foo').should.equal(5)
      inst.getOption('lead', 'bar').should.equal('baz')
    })
  })
  describe('permissions', () => {
    it('denies permission on nonexistent permission byte', () => {
      return inst.hasPermission('foo', 'bar').should.eventually.be.false
    })
    it('denies permission on existing permission byte with unset bit', () => {
      return inst.grantPermission('foo', 'baz').then(() => {
        return inst.hasPermission('foo', 'bar').should.eventually.be.false
      })
    })
    it('has permission after successful grant', () => {
      return inst.grantPermission('foo', 'bar').then(() => {
        return inst.hasPermission('foo', 'bar').should.eventually.be.true
      })
    })
    it('denies permission after a revoke', () => {
      inst.grantPermission('foo', 'bar').then(() => {
        return inst.revokePermission('foo', 'bar')
      }).then(() => {
        return inst.hasPermission('foo', 'bar').should.eventually.be.false
      })
    })
    it('has no effect when revoking an unset permission', () => {
      return inst.revokePermission('foo', 'bar').then(() => {
        return inst.hasPermission('foo', 'bar').should.eventually.be.false
      })
    })
    it('grants and checks multiple permissions', () => {
      const perms = ['bar', 'baz']
      return inst.grantPermissions('foo', perms).then(() => {
        return inst.hasPermissions('foo', perms).should.eventually.be.true
      })
    })
    it('grants and revokes multiple permissions', () => {
      const perms = ['bar', 'baz']
      return inst.grantPermissions('foo', perms).then(() => {
        return inst.revokePermissions('foo', perms)
      }).then(() => {
        return inst.hasPermissions('foo', perms).should.eventually.be.false
      })
    })
    it('fails to grant unknown permissions in a known domain', () => {
      return inst.grantPermission('foo', 'foo').should.be.rejected
    })
    it('fails to grant permissions for unknown domains', () => {
      return inst.grantPermission('bar', 'bar').should.be.rejected
    })
  })
  describe('signatures', () => {
    it('signs a token', () => {
      return inst.sign('goodKey', { subject: 'foo' }).then(token => {
        token.should.be.a.string
        token.split('.').should.have.length(3)
      })
    })
    it('encodes permissions when signing', () => {
      return inst.grantPermission('foo', 'bar').then(() => {
        return inst.sign('goodKey', { subject: 'foo' })
      }).then(token => {
        inst = new Token(Object.assign({}, tokenOpts, { token }))
        return inst.hasPermission('foo', 'bar').should.eventually.be.true
      })
    })
    it('supports domains without permissions', () => {
      inst.setOption('foo', 'bar', 'baz')
      return inst.sign('goodKey', { subject: 'foo' }).then(token => {
        inst = new Token({ token })
        inst.getOption('foo', 'bar').should.equal('baz')
      })
    })
    it('assigns the given expiration', () => {
      return inst.sign('goodKey', { subject: 'foo', expiresIn: '1m' }).then(token => {
        inst = new Token({ token })
        inst.getClaim('exp').should.be.lessThan(new Date().getTime() + 61)
      })
    })
    it('allows the subject to exist in a claim only', () => {
      inst.setClaim('sub', 'foo@bar.baz')
      return inst.sign('goodKey')
    })
    it('throws when there is no subject', () => {
      return inst.sign.bind(inst, 'goodKey').should.throw(/subject is required/)
    })
    it('throws when the key ID is not in the key map', () => {
      return inst.sign.bind(inst, 'noKey', { subject: 'foo' }).should.throw(/not found/)
    })
    it('throws when the key has no priv property', () => {
      return inst.sign.bind(inst, 'emptyKey', { subject: 'foo' }).should.throw(/priv\b.*\bproperty/)
    })
    it('throws when the key has no algo property', () => {
      return inst.sign.bind(inst, 'privOnly', { subject: 'foo' }).should.throw(/algo\b.*\bproperty/)
    })
    it('rejects if the key is corrupt', () => {
      return inst.sign('corruptKey', { subject: 'foo' }).should.be.rejected
    })
  })
  describe('verify', () => {
    it('verifies a token immediately after signing, using the KID', () => {
      return inst.sign('goodKey', { subject: 'foo' }).then(() => {
        return inst.verify()
      })
    })
    it('verifies a token immediately after signing, using a provided key', () => {
      return inst.sign('goodKey', { subject: 'foo' }).then(() => {
        return inst.verify({ key: pubKey })
      })
    })
    it('verifies a token passed to the constructor', () => {
      inst = new Token(Object.assign({ token: testTokenStr }, tokenOpts))
      return inst.verify({ ignoreExpiration: true })
    })
    it('fails to verify an unsigned token', () => {
      return inst.verify().should.be.rejected
    })
    it('fails validation using maxAgeSecs', () => {
      inst = new Token(Object.assign({ token: testTokenStr }, tokenOpts))
      return inst.verify({ ignoreExpiration: true, maxAgeSecs: 10 }).should.be.rejected
    })
    it('calls function to get pub key via Promise', () => {
      const getPubKey = (kid) => {
        if (kid === 'goodKey') return Promise.resolve(pubKey)
        return Promise.reject(new Error('Bad KID'))
      }
      return inst.sign('goodKey', { subject: 'foo' }).then((token) => {
        inst = new Token({ token, getPubKey })
        return inst.verify()
      })
    })
    it('calls function to get pub key synchronously', () => {
      const getPubKey = (kid) => {
        if (kid === 'goodKey') return pubKey
        throw new Error('Bad KID')
      }
      return inst.sign('goodKey', { subject: 'foo' }).then((token) => {
        inst = new Token({ token, getPubKey })
        return inst.verify()
      })
    })
    it('gets pub key when priv key already exists', () => {
      const getPubKey = (kid) => {
        if (kid === 'privAlgo') return pubKey
        throw new Error('Bad KID')
      }
      return inst.sign('privAlgo', { subject: 'foo' }).then((token) => {
        inst = new Token(Object.assign({}, tokenOpts, { token, getPubKey }))
        return inst.verify()
      })
    })
    it('rejects with KeyNotFoundError when no pub key exists', () => {
      return inst.sign('goodKey', { subject: 'foo' }).then((token) => {
        inst = new Token({ token })
        return inst.verify().should.be.rejectedWith(KeyNotFoundError)
      })
    })
  })
})
