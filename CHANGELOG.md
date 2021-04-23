# Embassy Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

## [Development]

Nothing yet!

## [v2.0.2] - 2021-04-23

### Fixed

- Typescript types are now published with the package

## [v2.0.1] - 2021-01-14

### Fixed

- Updated build settings to include documentation. Intellisense in editors can now show TSDoc data.
- Corrected public/private scope issues in Token.js that exposed two private functions to the public and included them in the API documentation.

## [v2.0.0] - 2021-01-13

### Changes

- Embassy has been completely rewritten in TypeScript. While the API is similar to previous versions, there was no attempt to maintain backward-compatibility for this first major release. Notable changes follow.
- Permissions have been changed to scopes, which can be granted and revoked as plain strings
- Claims can now be read and written directly on a `token.claims` object without accessor functions
- HMAC signing and verification is now supported

## v1.0.0

This version intentionally skipped due to 2015 publishing error

## [v0.3.2]

### Fixed

- Updated all dependencies to resolve security warnings

## [v0.3.1]

### Fixed

- Updated all dependencies to resolve security warnings

## [v0.3.0]

### Added

- refreshPermissions, getPrivKey, and getPubKey are now called with the Token object itself as the final argument.

## [v0.2.2]

### Fixed

- options.getPrivKey is now called when a public key for the same KID already exists

## [v0.2.1]

### Fixed

- sign() can now be called when an `exp` claim is already set. Embassy will delete the existing claim before calculating the new one and signing.

## [v0.2.0]

### Added

- The `getPrivKey` option to dynamically load a private signing key.

### Changed

- The sign() function now only throws if the subject is not found. Key resolution errors are rejections with a KeyNotFoundError.

## v0.1.0

### Added

- Initial release

[development]: https://github.com/TomFrost/Embassy/compare/v2.0.2...HEAD
[v2.0.1]: https://github.com/TomFrost/Embassy/compare/v2.0.1...v2.0.2
[v2.0.1]: https://github.com/TomFrost/Embassy/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/TomFrost/Embassy/compare/v0.3.2...v2.0.0
[v0.3.2]: https://github.com/TomFrost/Embassy/compare/v0.3.1...v0.3.2
[v0.3.1]: https://github.com/TomFrost/Embassy/compare/v0.3.0...v0.3.1
[v0.3.0]: https://github.com/TomFrost/Embassy/compare/v0.2.2...v0.3.0
[v0.2.2]: https://github.com/TomFrost/Embassy/compare/v0.2.1...v0.2.2
[v0.2.1]: https://github.com/TomFrost/Embassy/compare/v0.2.0...v0.2.1
[v0.2.0]: https://github.com/TomFrost/Embassy/compare/v0.1.0...v0.2.0
