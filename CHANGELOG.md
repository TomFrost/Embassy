# Embassy Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## [Development]
Nothing yet!

## [v0.2.0]
### Added
- The `getPrivKey` option to dynamically load a private signing key.

### Changed
- The sign() function now only throws if the subject is not found. Key resolution errors are rejections with a KeyNotFoundError.

## v0.1.0
### Added
- Initial release

[Development]: https://github.com/TechnologyAdvice/Squiss/compare/v0.2.0...HEAD
[v0.2.0]: https://github.com/TechnologyAdvice/Squiss/compare/v0.1.0...v0.2.0
