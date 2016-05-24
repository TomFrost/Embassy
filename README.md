# Embassy [![Build Status](https://travis-ci.org/TechnologyAdvice/Embassy.svg?branch=master)](https://travis-ci.org/TechnologyAdvice/Embassy) [![Test Coverage](https://codeclimate.com/github/TechnologyAdvice/Embassy/badges/coverage.svg)](https://codeclimate.com/github/TechnologyAdvice/Embassy/coverage)
Generate and verify Javascript Web Tokens, containing dynamic microservice permissions and settings.

## Use cases

While Embassy can be used to provide tokens for an OAuth or OpenID Connect flow, it was built to solve the problem of authentication and permission control in a durable microservices environment. Suggested implementation:

- In each of your microservices, define an array of boolean permissions such as canEditUsers in your users service, or canUploadFiles, canDeleteFiles in your hypothetical file management service.
- Implement a user management service that assigns permissions to users in any manner
- Allow users to authenticate with that service via your favorite secure method
- Provide the user with an Embassy token, setting the user's permissions and options for each individual microservice. Options are non-boolean values that get stored in the token.
- Implement Embassy in all your microservices. On each request to a privileged endpoint, validate the token. If it's valid, check it for the permissions or options that endpoint requires. Use identifying information in the token's claims for your log messages.
- Implement Embassy in any frontends that need to know what permissions an authenticated user has in order to streamline their experience. Embassy was designed with frontend builds in mind!
- Bask in the knowledge that your user service can go completely dead without interrupting the service of your logged-in users, or compromising your security.

## Installation

```
npm install --save embassy
```

## Example

```javascript
const Embassy = require('embassy')

const embassy = new Embassy({
  domainPermissions: {
    userService: {
      writeUsers: 0,
      readUsers: 1,
      deleteUsers: 2
    },
    chatService: {
      sendMessages: 0,
      deleteOwnMessages: 1,
      deleteOthersMessages: 2
    }
  },
  keys: {
    '2016-05-20': {
      pub: 'pem-encoded-pubkey',
      priv: 'pem-encoded-privkey',
      algo: 'ES256'
    }
  },
  issuer: 'userservice.myapp.com',
  expiresInSecs: 900
})

// Create a user token after successful login
const token = embassy.createToken({ sub: 'someuser@someplace.com' })
token.setOption('chatService', 'adminRank', 2)
token.grantPermission('userService', 'readUsers').then(() => {
  return token.sign('2016-05-20')
}).then(token => {
  // token is now a JWT/OpenID Connect string, containing the user's
  // email, options, and binary-encoded permissions.
}).catch(e => {
  // We'd end up here if the permission we set is unknown, or the key
  // ID we used didn't have a 'priv' component.
})

// Validate a user's token and read its data
const token = embassy.parseToken(tokenString)
token.verify().then(() => {
  console.log(token.getOption('chatService', 'adminRank')) // 2
  return token.hasPermission('userService', 'readUsers')
}).then(hasPerm => {
  console.log(hasPerm) // true
}).catch(e => {
  // We'd end up here if the issuer string doesn't match what was set in
  // Embassy, if the token is older than 900 seconds, if the signature
  // was forged, or if the permission we're checking for is unknown.
})
```

## API
### Embassy
#### new Embassy([options])
Embassy must be instantiated with any necessary options before it can be used. Available options are:
- **domainPermissions:** A map of domains (service names) to permission maps. Permission maps store permission names as keys, with the values being unique integers; preferably incrementing up from zero. The integer defines which bit in a binary blob represents this permission, so it's imperative that the number not be changed or reused while there are still active tokens.
- **keys:** A mapping of key IDs to key objects used for signing and verifying tokens. Key objects require `priv` (a private key or HMAC secret) and `algo` (the [crypto algorithm](https://github.com/auth0/node-jsonwebtoken#algorithms-supported) to use) for token signing. Additionally, provide `pub` (a public key or HMAC secret) for key verification.
- **refreshPermissions:** An optional function that, when called, will return either a replacement domainPermissions map, or a Promise that resolves to one. Only called when Embassy encounters a permission that doesn't exist in its current domainPermissions map. Using this, permissions can be stored in a database and created in real time in a live system.
- **refreshPermsAfterMs:** _Default 500._ The number of milliseconds after the domainPermissions have been refreshed that it is eligible to be refreshed again.
- **getPubKey:** An optional function that, when called with a key ID, will return either the public key/HMAC secret for that ID, or a Promise that resolves to one. Using this, public keys can be stored in a highly durable, publicly accessible URL, and private keys can be rotated in the token-generating service without having to inform the other microservices of new keys.
- **expiresInSecs:** The number of seconds after a token has been created at which it will expire. This can be overridden when the token is signed.
- **audience:** An arbitrary string defining who the intended audience for this token is. If specified, any tokens that do not have this audience string will fail validation.
- **issuer:** An arbitrary string defining who the issuer of this token is. If specified, any tokens that do not have this issuer string will fail validation.

#### embassy.createToken([claims])
Creates a new Token object, optionally initialized with the given map of claims. Claims are small bits of information about the token or user, such as "sub" ("subject", normally the user ID or email), or nonstandard items like avatar URLs, real name, etc.

#### embassy.parseToken(token)
Parses a signed token string and returns a new Token object initialized with its contents. The Token object will be immediately ready for a `.verify()` call to determine its authenticity.

#### Embassy properties
Embassy exposes a set of convenience properties:
- **Embassy.Token:** The Token class
- **Embassy.KeyNotFoundError:** Thrown when `Token.sign` or `Token.verify` references an unknown Key ID.
- **Embassy.PermissionNotFoundError:** Thrown when a permission is referenced that does not exist in `domainPermissions`, and `refreshPermissions` was either not specified or did not produce a permissions map containing the permission.
- **Embassy.TokenParseError:** Thrown when `embassy.parseToken` is called with an invalid token string.

### Token
#### new Token([options])
The Token class is rarely instantiated directly; instead, use `embassy.createToken` and `embassy.parseToken` so that keys and domainPermissions are persisted throughout all an Embassy's tokens. However, if necessary to use this, Token accepts all options that Embassy does, plus these:
- **claims:** A set of claims with which to initialize this Token
- **token:** A token string with which to initialize this Token

#### token.getClaim(claim)
Returns the value for a given claim, or undefined if it doesn't exist.

#### token.getOption(domain, optName)
Gets the value for a given option name within a certain domain (microservice name), or undefined if it doesn't exist.

#### token.grantPermission(domain, permission)
Grants the given permission inside of the given domain. Returns a Promise that resolves on success, or rejects with `Embassy.PermissionNotFoundError` if the given permission cannot be found.

#### token.grantPermissions(domain, permissions)
Grants an array of permissions inside the given domain. Returns a Promise that resolves on success, or rejects with `Embassy.PermissionNotFoundError` if any given permission cannot be found.

#### token.hasPermission(domain, permission)
Returns a Promise that resolves with true if the token has the given permission for the given domain, or false otherwise. Rejects with `Embassy.PermissionNotFoundError` if the given permission cannot be found.

#### token.hasPermissions(domain, permissions)
Returns a Promise that resolves with true if the token has each given permission for the given domain, or false otherwise. Rejects with `Embassy.PermissionNotFoundError` if any given permission cannot be found.

#### token.revokePermission(domain, permission)
Revokes the given permission from a token. Returns a Promise that resolves on success, or rejects with `Embassy.PermissionNotFoundError` if the given permission cannot be found.

#### token.revokePermissions(domain, permissions)
Revokes an array of permissions from the given domain in the token. Returns a Promise that resolves on success, or rejects with `Embassy.PermissionNotFoundError` if any given permission cannot be found.

#### token.setClaim(claim, val)
Sets a claim within the body of the JSON Web Token (JWT). Note that JWTs have a standard set of claims that should not be overridden!

#### token.setOption(domain, key, val)
Sets a domain-specific option on this token. `val` can be anything that will serialize to JSON, but it's recommended to keep token-stored information as small as possible to reduce bandwidth usage and avoid HTTP header size constraints (if it's passed in an HTTP header).

#### token.sign(keyID, [options])
Serializes the data set within this Token instance and signs it with a private key. The result is a Promise that resolves with a JWT token string. `keyID` should be the ID of a key set in the constructor for either Token or Embassy. The available options override any constructor-specified options, if provided:
- **expiresInSecs:** _Default 900._ The number of seconds after a token has been created at which it will expire.
- **audience:** An arbitrary string representing the intended audience for this token.
- **subject:** The ID of the intended user of this token. Optional only if a 'sub' claim has already been set.
- **issuer:** A string representing the issuer of this token.
- **noTimestamp:** _Default false._ Set to `true` to avoid generating an 'iat' (issued at) claim.
- **header:** A mapping of keys and values to be set in the token header, additionally to what the signing process creates by default.

#### token.verify([options])
Verifies a token's validity by checking its signature, expiration time, and contents. This method returns a Promise that resolves on success, or rejects if the token is invalid. Note that this can only be called if the Token was initialized with a token string, or if `token.sign` has already been called. The available options override any constructor-specified options, if provided:
- **algorithms:** List of strings with the names of the allowed algorithms. For instance, `["HS256", "HS384"]`. Allows all algorithms if omitted. See the [list of supported algorithms](https://github.com/auth0/node-jsonwebtoken#algorithms-supported).
- **audience:** Ensures the token's audience string matches this value.
- **issuer:** Ensures the token's issuer string matches this value.
- **ignoreExpiration:** _Default false._ If true, expired tokens will pass verification checks.
- **maxAgeSecs:** If specified, will fail verification if the token is older than the specified number of seconds.
- **key:** The PEM-encoded public key to be used to verify the token's signature. If specified, the key ID will be ignored. May be provided as a String or Buffer.

## Generating keys

For asymmetric token signing, the openssl tool can handle creating all the different [key types](https://github.com/auth0/node-jsonwebtoken#algorithms-supported) Embassy supports. 256-bit Elliptic Curve keys (ES256) are recommended due to their low overhead and high security. The following commands will generate a PEM-formatted key pair (replace KEY_ID appropriately):

```
# Private key
openssl ecparam -genkey -name secp256k1 -noout -out KEY_ID.priv.pem
# Public key
openssl ec -in KEY_ID.priv.pem -pubout -out KEY_ID.pub.pem
```

## Versions
Embassy supports Node 4 LTE and higher out of the box. For 0.12 or frontend support, consider compiling with Babel.

## License
Embassy is Copyright (c) 2016 TechnologyAdvice LLC, released under the ultra-permissive ISC license. See LICENSE.txt for details.
