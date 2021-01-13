embassy / [Exports](modules.md)

<!-- LOGO AND SHIELDS -->
<br />
<p align="center">
  <a href="https://github.com/TomFrost/Embassy">
    <img src="http://i.tomfro.st/uTz1mF.svg" alt="Embassy Logo" width="400" height="250">
  </a>

  <h3 align="center">Simple JSON Web Tokens (JWT) with embedded scopes for services</h3>

  <p align="center">
    Create access, ID, and refresh tokens • Embed hundreds of scopes in a small token string • Zero-IO token verification in your services • Auto-download and cache missing keys • As easy as <code>embassy.parseToken(token).verify()</code>
    <br />
    <a href="https://github.com/TomFrost/Embassy/blob/master/docs/modules.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://www.npmjs.com/package/embassy"><img alt="npm" src="https://img.shields.io/npm/v/embassy?style=flat-square"></a>
    <a href="https://travis-ci.org/TomFrost/Embassy"><img src="https://img.shields.io/travis/tomfrost/embassy/master?style=flat-square" alt="build status" height="20"></a>
    <a href="https://www.npmjs.com/package/embassy"><img alt="download count" src="https://img.shields.io/npm/dm/embassy?style=flat-square"></a>
    <a href="https://codeclimate.com/github/TomFrost/Embassy"><img alt="Code Climate coverage" src="https://img.shields.io/codeclimate/coverage/TomFrost/Embassy?style=flat-square"></a>
    <a href="https://github.com/TomFrost/Embassy/blob/master/LICENSE.txt"><img alt="License" src="https://img.shields.io/github/license/tomfrost/embassy?style=flat-square"></a>
  </p>
</p>

## Install

```shell
npm install --save embassy
```

or

```shell
yarn add embassy
```

## Initialize

```javascript
import { Embassy } from 'embassy'

const embassy = new Embassy({
  domainScopes: {
    users: {
      readEmail: 0,
      readProfile: 1,
      writeProfile: 2
    },
    store: {
      readPurchaseHistory: 0,
      addToCart: 1,
      submitOrder: 2,
      cancelOrder: 3
    }
  },
  keys: {
    myKey: {
      privateKey: 'shared-secret',
      algorithm: 'HS512'
    }
  },
  issuer: 'api.myapp.com/auth',
  audience: 'api.myapp.com'
})
```

Embassy can be configured to find public and private keys when an unknown key ID is found, and refresh the scopes when an unknown scope is encountered. Always run smoothly without forced restarts or configuration updates. **[See the options »](https://github.com/TomFrost/Embassy/blob/master/docs/interfaces/embassyoptions.md)**

## Integrate

### Create and sign access tokens

```javascript
const token = embassy.createToken({
  sub: 'userid',
  email: 'user@email.com'
})
const tokenString = await token.sign('myKey')
// Token expires in an hour by default
```

**[embassy.createToken docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/embassy.md#createtoken) • [token.sign docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/token.md#sign)**

### Verify access tokens

```javascript
const token = embassy.parseToken(bearerToken)
const claims = await token.verify() // Throws if invalid, expired, etc
console.log(`New request from ${claims.email}`)
```

**[embassy.parseToken docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/embassy.md#parsetoken) • [token.verify docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/token.md#verify)**

### Create and sign refresh tokens

```javascript
const token = embassy.createToken({
  sub: 'userid',
  email: 'user@email.com'
})
const tokenString = await token.sign('myKey', {
  audience: 'api.myapp.com/auth', // Prevent this from being used as an access token
  expiresInSecs: 3600 * 24 * 365 // Make it last for a year
})
```

**[embassy.createToken docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/embassy.md#createtoken) • [token.sign docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/token.md#sign)**

### Verify refresh tokens

```javascript
const token = embassy.parseToken(bearerToken)
const claims = await token.verify({
  audience: 'api.myapp.com/auth'
}) // Throws if invalid, expired, wrong audience, etc
console.log(`Checking if ${claims.email} is still in good status...`)
```

**[embassy.parseToken docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/embassy.md#parsetoken) • [token.verify docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/token.md#verify)**

### Grant scopes to tokens

```javascript
// One at a time
await token.grantScope('user|readEmail')
// Many at a time
await token.grantScopes(['user|readProfile', 'user|writeProfile'])
// You can separate the domain
await token.grantScope('store', 'readPurchaseHistory')
// Or pass an entire domain-to-scopes map
await token.grantScopes({
  user: ['readProfile', 'writeProfile'],
  store: ['addToCart', 'submitOrder']
})
// Signing the token will encode these scopes in a binary format, so a
// single token can hold hundreds of scopes and still stay small!
```

**[token.grantScope docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/token.md#grantscope) • [token.grantScopes docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/token.md#grantscopes)**

_Tip: Change "grant" to "revoke" and it does exactly what you'd expect!_

### Query tokens for scopes

```javascript
// These each resolve with `true` or `false`:
// One at a time
await token.hasScope('user|readEmail')
// Many at a time
await token.hasScopes(['user|readProfile', 'user|writeProfile'])
// You can separate the domain
await token.hasScope('store', 'readPurchaseHistory')
// Or pass an entire domain-to-scopes map
await token.hasScopes({
  user: ['readProfile', 'writeProfile'],
  store: ['addToCart', 'submitOrder']
})
```

**[token.hasScope docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/token.md#hasscope) • [token.hasScopes docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/token.md#hasscopes)**

### Read and write claims

```javascript
console.log(`Request initiated by userId ${token.claims.sub}`)
token.claims.nonce = myNonce
// Token can be signed with no further action
```

**[Token docs](https://github.com/TomFrost/Embassy/blob/master/docs/classes/token.md)**

## Generate keys

### HMAC

HMAC is a symmetric signing algorithm, which means the same key is used to sign and verify the token. Embassy supports the following HMAC algorithms: `HS256`, `HS384`, `HS512`. Trying to choose? Higher numbers mean more security, but longer tokens and steeper CPU usage. Use `HS256` for access tokens since they're short-lived, and consider higher for refresh tokens.

The "shared secret" for HMAC can be any string -- but you should choose a long one! Be sure to keep it private. Never commit it to git, never send it over Slack, never give your CI/CD access to it.

### Asymmetric keys

Embassy supports the following RSA and Elliptic Curve signing algorithms: `RS256`, `RS384`, `RS512`, `PS256`, `PS384`, `PS512`, `ES256`, `ES384`, `ES512`. The algorithms sign tokens with a private key that must be kept secret, but verify their authenticity with a public key that can be shared openly.

For most use cases, 256-bit Elliptic Curve keys (ES256) are recommended for access tokens due to their low overhead and high security. The following commands will generate a PEM-formatted key pair appropriate for use with Embassy (replace `MyKeyPair` appropriately):

```shell
KEY_ID="MyKeyPair"
# Private key
openssl ecparam -genkey -name secp256k1 -noout -out "${KEY_ID}.priv.pem"
# Public key
openssl ec -in "${KEY_ID}.priv.pem" -pubout -out "${KEY_ID}.pub.pem"
```

## Versions

Embassy is committed to supporting all active LTE versions of Node.js, and strives to stay updated for new non-LTE releases.

## License

Embassy is Copyright (c) 2017-2021 Tom Shawver, released under the ultra-permissive ISC license. See LICENSE.txt for details.

## Credits

Created by [Tom Shawver](https://github.com/TomFrost) in 2016 as convenience layer on top of [Auth0](https://github.com/auth0)'s fantastic [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) Node.js library. Embassy was rewritten in Typescript in 2021.

Originally created for [TechnologyAdvice](http://www.technologyadvice.com) in Nashville, TN.
