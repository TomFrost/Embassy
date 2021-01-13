[embassy](../README.md) / [Exports](../modules.md) / TokenSigningOptions

# Interface: TokenSigningOptions

## Hierarchy

* [*ExpiringClaimsOptions*](expiringclaimsoptions.md)

  ↳ **TokenSigningOptions**

## Table of contents

### Properties

- [audience](tokensigningoptions.md#audience)
- [expiresInSecs](tokensigningoptions.md#expiresinsecs)
- [header](tokensigningoptions.md#header)
- [issuer](tokensigningoptions.md#issuer)
- [noTimestamp](tokensigningoptions.md#notimestamp)
- [subject](tokensigningoptions.md#subject)

## Properties

### audience

• `Optional` **audience**: *string*

The audience string with which to sign and verify tokens by default.

Inherited from: [ExpiringClaimsOptions](expiringclaimsoptions.md).[audience](expiringclaimsoptions.md#audience)

Defined in: [src/types.ts:120](https://github.com/TomFrost/Embassy/blob/af56526/src/types.ts#L120)

___

### expiresInSecs

• `Optional` **expiresInSecs**: *number*

The number of seconds after which a newly signed token should expire, by
default.

**`defaultvalue`** 3600

Inherited from: [ExpiringClaimsOptions](expiringclaimsoptions.md).[expiresInSecs](expiringclaimsoptions.md#expiresinsecs)

Defined in: [src/types.ts:134](https://github.com/TomFrost/Embassy/blob/af56526/src/types.ts#L134)

___

### header

• `Optional` **header**: *Partial*<[*JWTHeader*](jwtheader.md)\>

Additional header properties to set. Avoid for most use cases.

Defined in: [src/types.ts:246](https://github.com/TomFrost/Embassy/blob/af56526/src/types.ts#L246)

___

### issuer

• `Optional` **issuer**: *string*

The issuer string with which to sign and verify tokens by default.

Inherited from: [ExpiringClaimsOptions](expiringclaimsoptions.md).[issuer](expiringclaimsoptions.md#issuer)

Defined in: [src/types.ts:124](https://github.com/TomFrost/Embassy/blob/af56526/src/types.ts#L124)

___

### noTimestamp

• `Optional` **noTimestamp**: *boolean*

If true, this method will not generate an 'iat' (Issued At) claim.

**`defaultvalue`** false

Defined in: [src/types.ts:244](https://github.com/TomFrost/Embassy/blob/af56526/src/types.ts#L244)

___

### subject

• `Optional` **subject**: *string*

The ID of the intended user of this token. Optional only if a 'sub' claim
has already been set.

Defined in: [src/types.ts:238](https://github.com/TomFrost/Embassy/blob/af56526/src/types.ts#L238)
