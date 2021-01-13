[embassy](../README.md) / [Exports](../modules.md) / Embassy

# Class: Embassy

## Hierarchy

* **Embassy**

## Table of contents

### Constructors

- [constructor](embassy.md#constructor)

### Methods

- [createToken](embassy.md#createtoken)
- [parseToken](embassy.md#parsetoken)

## Constructors

### constructor

\+ **new Embassy**(`opts?`: [*EmbassyOptions*](../interfaces/embassyoptions.md)): [*Embassy*](embassy.md)

Creates a new Embassy instance.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`opts` | [*EmbassyOptions*](../interfaces/embassyoptions.md) | ... | Options with which to initialize every new [Token](token.md).    |

**Returns:** [*Embassy*](embassy.md)

Defined in: [src/Embassy.ts:10](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/Embassy.ts#L10)

## Methods

### createToken

▸ **createToken**(`claims?`: [*ManualClaims*](../interfaces/manualclaims.md)): [*Token*](token.md)

Creates a new Token, optionally initializing it with a set of claims.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`claims?` | [*ManualClaims*](../interfaces/manualclaims.md) | A mapping of JWT claim keys to appropriate values   |

**Returns:** [*Token*](token.md)

The newly created Token

Defined in: [src/Embassy.ts:27](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/Embassy.ts#L27)

___

### parseToken

▸ **parseToken**(`token`: *string*): [*Token*](token.md)

Creates a Token object from a signed JWT string.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`token` | *string* | The JWT to be parsed   |

**Returns:** [*Token*](token.md)

A token object, initiated with the data contained in the token
string

Defined in: [src/Embassy.ts:38](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/Embassy.ts#L38)
