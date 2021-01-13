[embassy](README.md) / Exports

# embassy

## Table of contents

### Classes

- [Embassy](classes/embassy.md)
- [JsonWebTokenError](classes/jsonwebtokenerror.md)
- [KeyNotFoundError](classes/keynotfounderror.md)
- [ScopeNotFoundError](classes/scopenotfounderror.md)
- [Token](classes/token.md)
- [TokenExpiredError](classes/tokenexpirederror.md)
- [TokenParseError](classes/tokenparseerror.md)

### Interfaces

- [Claims](interfaces/claims.md)
- [CommonClaimsOptions](interfaces/commonclaimsoptions.md)
- [EmbassyOptions](interfaces/embassyoptions.md)
- [ExpiringClaimsOptions](interfaces/expiringclaimsoptions.md)
- [JWTHeader](interfaces/jwtheader.md)
- [ManualClaims](interfaces/manualclaims.md)
- [ScopeComponents](interfaces/scopecomponents.md)
- [TokenOptions](interfaces/tokenoptions.md)
- [TokenSigningOptions](interfaces/tokensigningoptions.md)
- [TokenVerificationOptions](interfaces/tokenverificationoptions.md)

### Type aliases

- [AsymmetricAlgorithm](modules.md#asymmetricalgorithm)
- [ClaimValue](modules.md#claimvalue)
- [DomainKey](modules.md#domainkey)
- [DomainScopeMap](modules.md#domainscopemap)
- [DomainScopes](modules.md#domainscopes)
- [KeyDefinition](modules.md#keydefinition)
- [PrivateKeyDefinition](modules.md#privatekeydefinition)
- [ScopeLoopFunction](modules.md#scopeloopfunction)
- [Serializable](modules.md#serializable)
- [SigningAlgorithm](modules.md#signingalgorithm)
- [SymmetricAlgorithm](modules.md#symmetricalgorithm)

### Variables

- [asymmetricAlgorithms](modules.md#asymmetricalgorithms)
- [symmetricAlgorithms](modules.md#symmetricalgorithms)

## Type aliases

### AsymmetricAlgorithm

Ƭ **AsymmetricAlgorithm**: *typeof* [*asymmetricAlgorithms*](modules.md#asymmetricalgorithms)[*number*]

Defined in: [src/types.ts:58](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L58)

___

### ClaimValue

Ƭ **ClaimValue**: [*Serializable*](modules.md#serializable) \| *Record*<*string*, [*Serializable*](modules.md#serializable)\>

Defined in: [src/types.ts:28](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L28)

___

### DomainKey

Ƭ **DomainKey**: { `domain`: *string* ; `key`: *string*  }

#### Type declaration:

Name | Type |
------ | ------ |
`domain` | *string* |
`key` | *string* |

Defined in: [src/types.ts:40](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L40)

___

### DomainScopeMap

Ƭ **DomainScopeMap**: { [domain: string]: { [scope: string]: *number*;  };  }

Defined in: [src/types.ts:34](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L34)

___

### DomainScopes

Ƭ **DomainScopes**: { [domain: string]: *string*[];  }

Defined in: [src/types.ts:30](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L30)

___

### KeyDefinition

Ƭ **KeyDefinition**: { `algorithm`: [*SigningAlgorithm*](modules.md#signingalgorithm) ; `privateKey`: *string* ; `publicKey?`: *string*  } \| { `algorithm`: [*AsymmetricAlgorithm*](modules.md#asymmetricalgorithm) ; `privateKey?`: *string* ; `publicKey`: *string*  }

Defined in: [src/types.ts:69](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L69)

___

### PrivateKeyDefinition

Ƭ **PrivateKeyDefinition**: { `algorithm`: [*SigningAlgorithm*](modules.md#signingalgorithm) ; `privateKey`: *string*  }

#### Type declaration:

Name | Type |
------ | ------ |
`algorithm` | [*SigningAlgorithm*](modules.md#signingalgorithm) |
`privateKey` | *string* |

Defined in: [src/types.ts:64](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L64)

___

### ScopeLoopFunction

Ƭ **ScopeLoopFunction**: (`domain`: *string*, `scope`: *string*, `breakFn`: () => *void*) => *void* \| *Promise*<*void*\>

A function to be called iteratively for multiple domain/scope pairs.

**`param`** The domain of a scope

**`param`** The scope string

**`param`** A function to be called to prevent the loop from continuing

Defined in: [src/types.ts:88](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L88)

___

### Serializable

Ƭ **Serializable**: *string* \| *number* \| *boolean* \| *null*

Defined in: [src/types.ts:26](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L26)

___

### SigningAlgorithm

Ƭ **SigningAlgorithm**: [*SymmetricAlgorithm*](modules.md#symmetricalgorithm) \| [*AsymmetricAlgorithm*](modules.md#asymmetricalgorithm)

Defined in: [src/types.ts:62](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L62)

___

### SymmetricAlgorithm

Ƭ **SymmetricAlgorithm**: *typeof* [*symmetricAlgorithms*](modules.md#symmetricalgorithms)[*number*]

Defined in: [src/types.ts:60](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L60)

## Variables

### asymmetricAlgorithms

• `Const` **asymmetricAlgorithms**: *Readonly*<*string*[]\>

Defined in: [src/types.ts:8](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L8)

___

### symmetricAlgorithms

• `Const` **symmetricAlgorithms**: *Readonly*<*string*[]\>

Defined in: [src/types.ts:20](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L20)
