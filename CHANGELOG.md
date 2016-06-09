# Embassy Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## [Development]
### Added
- The `getPrivKey` option to dynamically load a private signing key.

### Changed
- The sign() function now only throws if the subject is not found. Key resolution errors are rejections with a KeyNotFoundError.

## v0.1.0
### Added
- Initial release

[Development]: https://github.com/TechnologyAdvice/Squiss/compare/0.1.0...HEAD
