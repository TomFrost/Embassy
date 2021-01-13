[embassy](../README.md) / [Exports](../modules.md) / TokenSigningOptions

# Interface: TokenSigningOptions

## Hierarchy

* *ExpiringClaimsOptions*

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

Defined in: [src/types.ts:130](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L130)

___

### expiresInSecs

• `Optional` **expiresInSecs**: *number*

The number of seconds after which a newly signed token should expire, by
default.

**`defaultvalue`** 3600

Defined in: [src/types.ts:144](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L144)

___

### header

• `Optional` **header**: *Partial*<[*JWTHeader*](jwtheader.md)\>

Additional header properties to set. Avoid for most use cases.

Defined in: [src/types.ts:256](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L256)

___

### issuer

• `Optional` **issuer**: *string*

The issuer string with which to sign and verify tokens by default.

Defined in: [src/types.ts:134](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L134)

___

### noTimestamp

• `Optional` **noTimestamp**: *boolean*

If true, this method will not generate an 'iat' (Issued At) claim.

**`defaultvalue`** false

Defined in: [src/types.ts:254](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L254)

___

### subject

• `Optional` **subject**: *string*

The ID of the intended user of this token. Optional only if a 'sub' claim
has already been set.

Defined in: [src/types.ts:248](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L248)
