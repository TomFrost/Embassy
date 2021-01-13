[embassy](../README.md) / [Exports](../modules.md) / ExpiringClaimsOptions

# Interface: ExpiringClaimsOptions

## Hierarchy

* [*CommonClaimsOptions*](commonclaimsoptions.md)

  ↳ **ExpiringClaimsOptions**

  ↳↳ [*EmbassyOptions*](embassyoptions.md)

  ↳↳ [*TokenSigningOptions*](tokensigningoptions.md)

## Table of contents

### Properties

- [audience](expiringclaimsoptions.md#audience)
- [expiresInSecs](expiringclaimsoptions.md#expiresinsecs)
- [issuer](expiringclaimsoptions.md#issuer)

## Properties

### audience

• `Optional` **audience**: *string*

The audience string with which to sign and verify tokens by default.

Inherited from: [CommonClaimsOptions](commonclaimsoptions.md).[audience](commonclaimsoptions.md#audience)

Defined in: [src/types.ts:120](https://github.com/TomFrost/Embassy/blob/af56526/src/types.ts#L120)

___

### expiresInSecs

• `Optional` **expiresInSecs**: *number*

The number of seconds after which a newly signed token should expire, by
default.

**`defaultvalue`** 3600

Defined in: [src/types.ts:134](https://github.com/TomFrost/Embassy/blob/af56526/src/types.ts#L134)

___

### issuer

• `Optional` **issuer**: *string*

The issuer string with which to sign and verify tokens by default.

Inherited from: [CommonClaimsOptions](commonclaimsoptions.md).[issuer](commonclaimsoptions.md#issuer)

Defined in: [src/types.ts:124](https://github.com/TomFrost/Embassy/blob/af56526/src/types.ts#L124)
