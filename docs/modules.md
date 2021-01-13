[embassy](README.md) / Exports

# embassy

## Table of contents

### Classes

- [Embassy](classes/embassy.md)
- [JsonWebTokenError](classes/jsonwebtokenerror.md)
- [KeyNotFoundError](classes/keynotfounderror.md)
- [NotBeforeError](classes/notbeforeerror.md)
- [ScopeNotFoundError](classes/scopenotfounderror.md)
- [Token](classes/token.md)
- [TokenExpiredError](classes/tokenexpirederror.md)
- [TokenParseError](classes/tokenparseerror.md)

### Interfaces

- [Claims](interfaces/claims.md)
- [DomainScopeMap](interfaces/domainscopemap.md)
- [DomainScopes](interfaces/domainscopes.md)
- [EmbassyOptions](interfaces/embassyoptions.md)
- [JWTHeader](interfaces/jwtheader.md)
- [ManualClaims](interfaces/manualclaims.md)
- [TokenOptions](interfaces/tokenoptions.md)
- [TokenSigningOptions](interfaces/tokensigningoptions.md)
- [TokenVerificationOptions](interfaces/tokenverificationoptions.md)

### Type aliases

- [AsymmetricAlgorithm](modules.md#asymmetricalgorithm)
- [ClaimValue](modules.md#claimvalue)
- [KeyDefinition](modules.md#keydefinition)
- [PrivateKeyDefinition](modules.md#privatekeydefinition)
- [Serializable](modules.md#serializable)
- [SigningAlgorithm](modules.md#signingalgorithm)
- [SymmetricAlgorithm](modules.md#symmetricalgorithm)

### Variables

- [asymmetricAlgorithms](modules.md#asymmetricalgorithms)
- [symmetricAlgorithms](modules.md#symmetricalgorithms)

## Type aliases

### AsymmetricAlgorithm

Ƭ **AsymmetricAlgorithm**: *typeof* [*asymmetricAlgorithms*](modules.md#asymmetricalgorithms)[*number*]

Defined in: [src/types.ts:68](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L68)

___

### ClaimValue

Ƭ **ClaimValue**: [*Serializable*](modules.md#serializable) \| *Record*<*string*, [*Serializable*](modules.md#serializable)\>

Defined in: [src/types.ts:38](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L38)

___

### KeyDefinition

Ƭ **KeyDefinition**: { `algorithm`: [*SigningAlgorithm*](modules.md#signingalgorithm) ; `privateKey`: *string* ; `publicKey?`: *string*  } \| { `algorithm`: [*AsymmetricAlgorithm*](modules.md#asymmetricalgorithm) ; `privateKey?`: *string* ; `publicKey`: *string*  }

Defined in: [src/types.ts:79](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L79)

___

### PrivateKeyDefinition

Ƭ **PrivateKeyDefinition**: { `algorithm`: [*SigningAlgorithm*](modules.md#signingalgorithm) ; `privateKey`: *string*  }

#### Type declaration:

Name | Type |
------ | ------ |
`algorithm` | [*SigningAlgorithm*](modules.md#signingalgorithm) |
`privateKey` | *string* |

Defined in: [src/types.ts:74](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L74)

___

### Serializable

Ƭ **Serializable**: *string* \| *number* \| *boolean* \| *null*

Defined in: [src/types.ts:36](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L36)

___

### SigningAlgorithm

Ƭ **SigningAlgorithm**: [*SymmetricAlgorithm*](modules.md#symmetricalgorithm) \| [*AsymmetricAlgorithm*](modules.md#asymmetricalgorithm)

Defined in: [src/types.ts:72](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L72)

___

### SymmetricAlgorithm

Ƭ **SymmetricAlgorithm**: *typeof* [*symmetricAlgorithms*](modules.md#symmetricalgorithms)[*number*]

Defined in: [src/types.ts:70](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L70)

## Variables

### asymmetricAlgorithms

• `Const` **asymmetricAlgorithms**: *Readonly*<*string*[]\>

An array of all supported asymmetric signing algorithms

Defined in: [src/types.ts:15](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L15)

___

### symmetricAlgorithms

• `Const` **symmetricAlgorithms**: *Readonly*<*string*[]\>

An array of all supported symmetric signing algorithms

Defined in: [src/types.ts:30](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L30)
