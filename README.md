# Embassy [![Build Status](https://travis-ci.org/TechnologyAdvice/Embassy.svg?branch=master)](https://travis-ci.org/TechnologyAdvice/Embassy) [![Test Coverage](https://codeclimate.com/github/TechnologyAdvice/Embassy/badges/coverage.svg)](https://codeclimate.com/github/TechnologyAdvice/Embassy/coverage)
Generate and verify Javascript Web Tokens that contain microservice permissions and settings

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
Coming soon! For now, check the abundant JSDoc in the source.

## Versions
Embassy supports Node 4 LTE and higher out of the box. For 0.12 or frontend support, consider compiling with Babel.

## License
Embassy is Copyright (c) 2016 TechnologyAdvice LLC, released under the ultra-permissive ISC license. See LICENSE.txt for details.
