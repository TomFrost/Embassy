[embassy](../README.md) / [Exports](../modules.md) / Token

# Class: Token

## Hierarchy

* **Token**

## Table of contents

### Constructors

- [constructor](token.md#constructor)

### Properties

- [claims](token.md#claims)
- [header](token.md#header)

### Methods

- [getOption](token.md#getoption)
- [getScopeComponents](token.md#getscopecomponents)
- [getScopeIndex](token.md#getscopeindex)
- [grantScope](token.md#grantscope)
- [grantScopes](token.md#grantscopes)
- [hasScope](token.md#hasscope)
- [hasScopes](token.md#hasscopes)
- [revokeScope](token.md#revokescope)
- [revokeScopes](token.md#revokescopes)
- [setOption](token.md#setoption)
- [sign](token.md#sign)
- [verify](token.md#verify)

## Constructors

### constructor

\+ **new Token**(`opts?`: [*TokenOptions*](../interfaces/tokenoptions.md)): [*Token*](token.md)

Creates a new Token.

**`throws`** [TokenParseError](tokenparseerror.md)
Thrown if the provided token cannot be parsed

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`opts` | [*TokenOptions*](../interfaces/tokenoptions.md) | ... | An object mapping of configuration objects   |

**Returns:** [*Token*](token.md)

Defined in: [src/Token.ts:37](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L37)

## Properties

### claims

• **claims**: [*Claims*](../interfaces/claims.md)

Defined in: [src/Token.ts:36](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L36)

___

### header

• **header**: [*JWTHeader*](../interfaces/jwtheader.md)

Defined in: [src/Token.ts:37](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L37)

## Methods

### getOption

▸ **getOption**<T\>(`domain`: *string*, `key`: *string*): T

Gets the content of a domain-specific option.

#### Type parameters:

Name | Type |
------ | ------ |
`T` | [*Serializable*](../modules.md#serializable) |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`domain` | *string* | The domain containing the requested option   |
`key` | *string* | The name of the option for which the value should be retrieved   |

**Returns:** T

The value of the requested option, or undefined

Defined in: [src/Token.ts:70](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L70)

___

### getScopeComponents

▸ **getScopeComponents**(`domain`: *string*, `scope`: *string*, `resize?`: *boolean*): *Promise*<[*ScopeComponents*](../interfaces/scopecomponents.md)\>

Gets the binary components of an individual scope, targeting the bit
that can be read or changed to interact with the encoded scope.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`domain` | *string* | - | The domain containing the target scope   |
`scope` | *string* | - | The name of the scope for which to retrieve the components   |
`resize` | *boolean* | false | `true` to resize the resulting blob to fit the chosen scope bit; `false` to return it in the currently stored size   |

**Returns:** *Promise*<[*ScopeComponents*](../interfaces/scopecomponents.md)\>

The components of the given scope

Defined in: [src/Token.ts:474](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L474)

___

### getScopeIndex

▸ **getScopeIndex**(`domain`: *string*, `scope`: *string*, `noRetry?`: *boolean*): *Promise*<*number*\>

Gets the index of the specified scope from the domainScopes map. If it's
not found, this method attempts to refresh that map with the refreshScopes
method before throwing a ScopeNotFoundError.

**`throws`** [ScopeNotFoundError](scopenotfounderror.md)
Thrown if the given scope does not exist in the domainScopes object and
did not appear when refreshing the domainScopes.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`domain` | *string* | - | The domain containing the target scope   |
`scope` | *string* | - | The name of the target scope   |
`noRetry` | *boolean* | false | `true` to not attempt to refresh the domainScopes map and retry this function; `false` to throw [ScopeNotFoundError](scopenotfounderror.md) immediately when a scope doesn't exist in domainScopes.   |

**Returns:** *Promise*<*number*\>

the index of the target permission

Defined in: [src/Token.ts:504](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L504)

___

### grantScope

▸ **grantScope**(`domain`: *string*, `scope`: *string*): *Promise*<*void*\>

Grants the given scope to this token within the specified domain.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`domain` | *string* | The domain that contains the scope to be granted   |
`scope` | *string* | The name of the scope to be granted    |

**Returns:** *Promise*<*void*\>

Defined in: [src/Token.ts:83](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L83)

▸ **grantScope**(`combined`: *string*): *Promise*<*void*\>

Grants the given scope to this token. If the scope string contains a `|`
character, the string up to the first `|` will be used as the domain under
which the scope will be grouped. Otherwise, the default domain of `app`
will be used.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`combined` | *string* | The scope string to be granted, optionally containing a domain in the format `domain|scopeName`    |

**Returns:** *Promise*<*void*\>

Defined in: [src/Token.ts:94](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L94)

___

### grantScopes

▸ **grantScopes**(`domainScopes`: [*DomainScopes*](../modules.md#domainscopes)): *Promise*<*void*\>

Grants the given array of scopes to this token.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`domainScopes` | [*DomainScopes*](../modules.md#domainscopes) | A map of domains to arrays of scopes in that domain to be granted to the token    |

**Returns:** *Promise*<*void*\>

Defined in: [src/Token.ts:111](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L111)

▸ **grantScopes**(`combined`: *string*[]): *Promise*<*void*\>

Grants the given array of scopes to this token.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`combined` | *string*[] | An array of strings in the format `domain|scope`. If the domain portion is missing, the default scope of "app" will be used.    |

**Returns:** *Promise*<*void*\>

Defined in: [src/Token.ts:119](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L119)

___

### hasScope

▸ **hasScope**(`domain`: *string*, `scope`: *string*): *Promise*<*boolean*\>

Checks to see whether this token contains the given scope.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`domain` | *string* | The domain that contains the scope to be checked   |
`scope` | *string* | The scope to be checked   |

**Returns:** *Promise*<*boolean*\>

`true` if the scope is included in this Token; `false` otherwise.

Defined in: [src/Token.ts:135](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L135)

▸ **hasScope**(`combined`: *string*): *Promise*<*boolean*\>

Checks to see whether this token contains the given scope. If the scope
string contains a `|` character, the string up to the first `|` will be
used as the domain under which the scope will be grouped. Otherwise, the
default domain of `app` will be used.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`combined` | *string* | The scope string to be checked, optionally containing a domain in the format `domain|scopeName`    |

**Returns:** *Promise*<*boolean*\>

Defined in: [src/Token.ts:146](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L146)

___

### hasScopes

▸ **hasScopes**(`domainScopes`: [*DomainScopes*](../modules.md#domainscopes)): *Promise*<*boolean*\>

Checks this token for the given scopes in the DomainScopes map.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`domainScopes` | [*DomainScopes*](../modules.md#domainscopes) | A map of domains to arrays of scopes in that domain to be checked   |

**Returns:** *Promise*<*boolean*\>

`true` if every scope of every domain exists on this Token;
`false` otherwise

Defined in: [src/Token.ts:164](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L164)

▸ **hasScopes**(`combined`: *string*[]): *Promise*<*boolean*\>

Checks this token for the given scopes in the provided array.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`combined` | *string*[] | An array of strings in the format `domain|scope`. If the domain portion is missing, the default scope of "app" will be used.   |

**Returns:** *Promise*<*boolean*\>

`true` if every scope of every domain exists on this Token;
`false` otherwise

Defined in: [src/Token.ts:174](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L174)

___

### revokeScope

▸ **revokeScope**(`domain`: *string*, `scope`: *string*): *Promise*<*void*\>

Revokes a scope that has been previously granted. This method is idempotent
and will not fail when revoking scopes that have not been granted.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`domain` | *string* | The domain that contains the scope to be revoked   |
`scope` | *string* | The name of the scope to be revoked    |

**Returns:** *Promise*<*void*\>

Defined in: [src/Token.ts:199](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L199)

▸ **revokeScope**(`combined`: *string*): *Promise*<*void*\>

Revokes a scope that has been previously granted. This method is idempotent
and will not fail when revoking scopes that have not been granted.

If the scope string contains a `|` character, the string up to the first
`|` will be used as the domain under which the scope will be grouped.
Otherwise, the default domain of `app` will be used.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`combined` | *string* | The scope string to be revoked, optionally containing a domain in the format `domain|scopeName`    |

**Returns:** *Promise*<*void*\>

Defined in: [src/Token.ts:212](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L212)

___

### revokeScopes

▸ **revokeScopes**(`domainScopes`: [*DomainScopes*](../modules.md#domainscopes)): *Promise*<*void*\>

Revokes a list of scopes that have been previously granted. This method is
idempotent and will not fail when revoking scopes that have not been
granted.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`domainScopes` | [*DomainScopes*](../modules.md#domainscopes) | A map of domains to arrays of scopes in that domain to be revoked from the token    |

**Returns:** *Promise*<*void*\>

Defined in: [src/Token.ts:233](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L233)

▸ **revokeScopes**(`combined`: *string*[]): *Promise*<*void*\>

Revokes a list of scopes that have been previously granted. This method is
idempotent and will not fail when revoking scopes that have not been
granted.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`combined` | *string*[] | An array of strings in the format `domain|scope`. If the domain portion is missing, the default scope of "app" will be used.    |

**Returns:** *Promise*<*void*\>

Defined in: [src/Token.ts:243](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L243)

___

### setOption

▸ **setOption**(`domain`: *string*, `key`: *string*, `val`: [*Serializable*](../modules.md#serializable)): *void*

Sets a domain-specific option on this token. Options are meant for holding
non-boolean settings. For boolean values, consider defining a new scope for
this domain. All options are stored in the `opt` claim at the top level.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`domain` | *string* | The domain in which to set the given option   |
`key` | *string* | The name of the option to be set   |
`val` | [*Serializable*](../modules.md#serializable) | The value for the option    |

**Returns:** *void*

Defined in: [src/Token.ts:261](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L261)

___

### sign

▸ **sign**(`kid`: *string*, `opts?`: [*TokenSigningOptions*](../interfaces/tokensigningoptions.md)): *Promise*<*string*\>

Serializes the claims within this Token and signs them cryptographically.
The result is an encoded JWT token string.

**`throws`** {@link Error}
Throws if options.subject was not specified, and the 'sub' claim has not
been set. A subject is a required claim for a valid JWT.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`kid` | *string* | - | An identifier for the key with which to sign this token. The private key or HMAC secret must either exist in the `keys` map passed in the constructor options, or be retrievable by the `getPrivateKey` function provided to the constructor.   |
`opts` | [*TokenSigningOptions*](../interfaces/tokensigningoptions.md) | ... | Options to configure the token signing process   |

**Returns:** *Promise*<*string*\>

the signed and encoded token string.

Defined in: [src/Token.ts:281](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L281)

___

### verify

▸ **verify**(`opts?`: [*TokenVerificationOptions*](../interfaces/tokenverificationoptions.md)): *Promise*<[*Claims*](../interfaces/claims.md)\>

Verifies a token's validity by checking its signature, expiration time,
and other conditions.

**`throws`** {@link jwt.TokenExpiredError}
Thrown when a token has passed the date in its `exp` claim

**`throws`** {@link jwt.JsonWebTokenError}
Thrown for most verification issues, such as a missing or invalid
signature, or mismatched audience or issuer strings

**`throws`** {@link jwt.NotBeforeError}
Thrown when the date in the `nbf` claim is in the future

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`opts` | [*TokenVerificationOptions*](../interfaces/tokenverificationoptions.md) | ... | Options to customize how the token is verified   |

**Returns:** *Promise*<[*Claims*](../interfaces/claims.md)\>

the token's claims when successfully verified.

Defined in: [src/Token.ts:325](https://github.com/TomFrost/Embassy/blob/46b38ed/src/Token.ts#L325)
