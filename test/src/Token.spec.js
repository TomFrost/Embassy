/*
 * Embassy
 * Copyright (c) 2017 Tom Shawver LLC
 */

/* globals describe, it, beforeEach, afterEach, before, after, should */
'use strict'

const Token = require('src/Token')
const TokenParseError = require('src/errors/TokenParseError')
const KeyNotFoundError = require('src/errors/KeyNotFoundError')
const PermissionNotFoundError = require('src/errors/PermissionNotFoundError')
const keys = require('../keys')
const delay = require('delay')

const testTokenStr = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6Imdvb2RLZXkifQ.eyJhdWQiOiJ0ZXN0LWF1ZGllbmNlIiwiaXN' +
  'zIjoidGVzdC1pc3N1ZXIiLCJzdWIiOiJiYXIiLCJwcm0iOiIiLCJpYXQiOjE0NjM4ODk0ODYsImV4cCI6MTQ2Mzg4OTQ5MX0.W6Ulky7iGnCp9OGt' +
  'bVzm_Bdz-FOOdL_2UFuaixsPE8FBQxtByG4nBNrUOcaT6_qJ7_tHZNqFfICQM24NzqxxgQ'
const domainPermissions = {
  foo: { bar: 0, baz: 1 }
}
const tokenOpts = {
  domainPermissions,
  keys: {
    goodKey: { pub: keys.pub, priv: keys.priv, algo: 'ES256' },
    emptyKey: { },
    privOnly: { priv: keys.priv },
    privAlgo: { priv: keys.priv, algo: 'ES256' },
    corruptKey: { pub: keys.pub, priv: keys.priv.toString().replace(/M/g, '@'), algo: 'ES256' }
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
    it('calls a function to refresh permissions via promise on grant', () => {
      const refreshPermissions = () => Promise.resolve(domainPermissions)
      inst = new Token({ refreshPermissions })
      return inst.grantPermission('foo', 'bar')
    })
    it('calls a function to refresh permissions asynchronously on grant', () => {
      const refreshPermissions = () => domainPermissions
      inst = new Token({ refreshPermissions })
      return inst.grantPermission('foo', 'bar')
    })
    it('calls a function to refresh permissions via promise on revoke', () => {
      const refreshPermissions = () => Promise.resolve(domainPermissions)
      inst = new Token({ refreshPermissions })
      return inst.revokePermission('foo', 'bar')
    })
    it('calls a function to refresh permissions via promise on check', () => {
      const refreshPermissions = () => Promise.resolve(domainPermissions)
      inst = new Token({ refreshPermissions })
      return inst.hasPermission('foo', 'bar')
    })
    it('stores results of last permission refresh for future calls', () => {
      let calls = 0
      const refreshPermissions = () => {
        calls++
        return domainPermissions
      }
      inst = new Token({ refreshPermissions })
      return inst.hasPermission('foo', 'bar').then(() => {
        calls.should.equal(1)
        return inst.hasPermission('foo', 'baz')
      }).then(() => {
        calls.should.equal(1)
      })
    })
    it('does not refresh permissions within refreshPermsAfterMs', () => {
      let calls = 0
      const refreshPermissions = () => {
        if (!calls++) return domainPermissions
        return { bar: { baz: 2 } }
      }
      inst = new Token({ refreshPermissions })
      return inst.hasPermission('foo', 'bar').then(() => {
        return inst.hasPermission('bar', 'baz').should.be.rejectedWith(PermissionNotFoundError)
      })
    })
    it('refreshes permissions outside of the refreshPermsAfterMs window', () => {
      let calls = 0
      const refreshPermissions = () => {
        if (!calls++) return domainPermissions
        return { bar: { baz: 2 } }
      }
      inst = new Token({ refreshPermissions, refreshPermsAfterMs: 10 })
      return inst.hasPermission('foo', 'bar')
        .then(() =>  delay(11))
        .then(() => inst.hasPermission('bar', 'baz'))
    })
    it('calls refreshPermissions with the token as an argument', () => {
      const refreshPermissions = (token) => {
        should.exist(token.getClaim('foo'))
        return domainPermissions
      }
      inst = new Token({ refreshPermissions })
      inst.setClaim('foo', 'bar')
      return inst.grantPermission('foo', 'bar')
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
      return inst.sign.bind(inst, 'goodKey').should.throw(Error, /subject is required/)
    })
    it('throws when the key ID is not in the key map', () => {
      return inst.sign('noKey', { subject: 'foo' }).should.be.rejectedWith(KeyNotFoundError, /not found/)
    })
    it('throws when the key has no priv property', () => {
      return inst.sign('emptyKey', { subject: 'foo' }).should.be.rejectedWith(KeyNotFoundError, /priv\b.*\bproperty/)
    })
    it('throws when the key has no algo property', () => {
      return inst.sign('privOnly', { subject: 'foo' }).should.be.rejectedWith(KeyNotFoundError, /algo\b.*\bproperty/)
    })
    it('rejects if the key is corrupt', () => {
      return inst.sign('corruptKey', { subject: 'foo' }).should.be.rejected
    })
    it('calls getPrivKey when the private key is not found', () => {
      inst = new Token({
        getPrivKey: kid => tokenOpts.keys[kid]
      })
      return inst.sign('privAlgo', { subject: 'foo' })
    })
    it('calls getPrivKey with the token as an argument', () => {
      inst = new Token({
        claims: { foo: 'bar' },
        getPrivKey: (kid, token) => {
          should.exist(token.getClaim('foo'))
          return tokenOpts.keys[kid]
        }
      })
      return inst.sign('privAlgo', { subject: 'foo' })
    })
    it('calls getPrivKey when only a pub key is present', () => {
      inst = new Token({
        getPrivKey: kid => tokenOpts.keys[kid],
        keys: { privAlgo: { pub: 'PEM' } }
      })
      return inst.sign('privAlgo', { subject: 'foo' })
    })
    it('supports promises from getPrivKey', () => {
      inst = new Token({
        getPrivKey: kid => Promise.resolve(tokenOpts.keys[kid])
      })
      return inst.sign('privAlgo', { subject: 'foo' })
    })
    it('caches the results of getPrivKey', () => {
      let hits = 0
      inst = new Token({
        getPrivKey: kid => { hits++; return tokenOpts.keys[kid] }
      })
      return inst.sign('privAlgo', { subject: 'foo' }).then(() => {
        hits.should.equal(1)
        return inst.sign('privAlgo', { subject: 'foo' })
      }).then(() => {
        hits.should.equal(1)
      })
    })
    it('supports signing when the exp claim is already set', () => {
      inst.setClaim('exp', 20)
      return inst.sign('privAlgo', { subject: 'foo' })
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
        return inst.verify({ key: keys.pub })
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
        if (kid === 'goodKey') return Promise.resolve(keys.pub)
        return Promise.reject(new Error('Bad KID'))
      }
      return inst.sign('goodKey', { subject: 'foo' }).then((token) => {
        inst = new Token({ token, getPubKey })
        return inst.verify()
      })
    })
    it('calls function to get pub key synchronously', () => {
      const getPubKey = (kid) => {
        if (kid === 'goodKey') return keys.pub
        throw new Error('Bad KID')
      }
      return inst.sign('goodKey', { subject: 'foo' }).then((token) => {
        inst = new Token({ token, getPubKey })
        return inst.verify()
      })
    })
    it('gets pub key when priv key already exists', () => {
      const getPubKey = (kid) => {
        if (kid === 'privAlgo') return keys.pub
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
    it('calls getPubKey with the token as an argument', () => {
      const getPubKey = (kid, token) => {
        token.getClaim('sub').should.equal('foo')
        if (kid === 'goodKey') return keys.pub
        throw new Error('Bad KID')
      }
      return inst.sign('goodKey', { subject: 'foo' }).then((token) => {
        inst = new Token({ token, getPubKey })
        return inst.verify()
      })
    })
  })
})
