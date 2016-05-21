/*
 * Embassy
 * Copyright (c) 2016, TechnologyAdvice LLC
 */

'use strict'

const Token = require('src/Token')
const TokenParseError = require('src/errors/TokenParseError')
const path = require('path')
const fs = require('fs')

/* globals describe, it, beforeEach, afterEach, before, after, should */
const privKey = fs.readFileSync(path.resolve('test/keys/test.priv.pem'))
const pubKey = fs.readFileSync(path.resolve('test/keys/test.pub.pem'))
const testTokenStr = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImZvbyJ9.eyJwcm0iOiIiLCJpYXQiOjE0NjM2NTc2MDgsImV4cCI6MTQ2MzY1ODUwOCwiYXVkIjoidGVzdC1hdWRpZW5jZSIsImlzcyI6InRlc3QtaXNzdWVyIiwic3ViIjoiYmFyIn0.9EyUOLF-5gDy8FU87kbVRC3G457Z83UAw8jfG-shIsEEWGeIqhejqKuaCCj7Diy9Z8sT0nNV2HaZhE8UfTBibQ'
const tokenOpts = {
  domainPermissions: {
    foo: { bar: 0, baz: 1 }
  },
  keys: {
    foo: { pub: pubKey, priv: privKey, algo: 'ES256' }
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
      const getInst = (...args) => () => new Token(...args)
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
      return inst.sign('foo', { subject: 'foo' }).then(token => {
        token.should.be.a.string
        token.split('.').should.have.length(3)
      })
    })
    it('verifies a token immediately after signing, using the KID', () => {
      return inst.sign('foo', { subject: 'foo' }).then(() => {
        return inst.verify()
      })
    })
    it('verifies a token immediately after signing, using a provided key', () => {
      return inst.sign('foo', { subject: 'foo' }).then(() => {
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
    it('encodes permissions when signing', () => {
      return inst.grantPermission('foo', 'bar').then(() => {
        return inst.sign('foo', { subject: 'foo' })
      }).then(token => {
        inst = new Token(Object.assign({}, tokenOpts, { token }))
        return inst.hasPermission('foo', 'bar').should.eventually.be.true
      })
    })
    it('supports domains without permissions', () => {
      inst.setOption('foo', 'bar', 'baz')
      return inst.sign('foo', { subject: 'foo' }).then(token => {
        inst = new Token({ token })
        inst.getOption('foo', 'bar').should.equal('baz')
      })
    })
    it('assigns the given expiration', () => {
      return inst.sign('foo', { subject: 'foo', expiresIn: '1m' }).then(token => {
        inst = new Token({ token })
        inst.getClaim('exp').should.be.lessThan(new Date().getTime() + 61)
      })
    })
  })
})
