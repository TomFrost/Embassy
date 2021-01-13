[embassy](../README.md) / [Exports](../modules.md) / TokenVerificationOptions

# Interface: TokenVerificationOptions

## Hierarchy

* [*CommonClaimsOptions*](commonclaimsoptions.md)

  ↳ **TokenVerificationOptions**

## Table of contents

### Properties

- [algorithms](tokenverificationoptions.md#algorithms)
- [audience](tokenverificationoptions.md#audience)
- [clockToleranceSecs](tokenverificationoptions.md#clocktolerancesecs)
- [ignoreExpiration](tokenverificationoptions.md#ignoreexpiration)
- [issuer](tokenverificationoptions.md#issuer)
- [key](tokenverificationoptions.md#key)
- [maxAgeSecs](tokenverificationoptions.md#maxagesecs)
- [nonce](tokenverificationoptions.md#nonce)

## Properties

### algorithms

• `Optional` **algorithms**: *string*[]

List of strings with the names of the allowed algorithms. Allows all
algorithms if omitted.

**`example`** 
```typescript
["HS256", "HS384"]
```

Defined in: [src/types.ts:259](https://github.com/TomFrost/Embassy/blob/eff2681/src/types.ts#L259)

___

### audience

• `Optional` **audience**: *string*

The audience string with which to sign and verify tokens by default.

Inherited from: [CommonClaimsOptions](commonclaimsoptions.md).[audience](commonclaimsoptions.md#audience)

Defined in: [src/types.ts:120](https://github.com/TomFrost/Embassy/blob/eff2681/src/types.ts#L120)

___

### clockToleranceSecs

• `Optional` **clockToleranceSecs**: *number*

The seconds of buffer to allow for differences between machine times when
verifying the token.

**`defaultvalue`** 5

Defined in: [src/types.ts:276](https://github.com/TomFrost/Embassy/blob/eff2681/src/types.ts#L276)

___

### ignoreExpiration

• `Optional` **ignoreExpiration**: *boolean*

`true` to allow expired tokens to pass verification checks, `false`
otherwise

Defined in: [src/types.ts:264](https://github.com/TomFrost/Embassy/blob/eff2681/src/types.ts#L264)

___

### issuer

• `Optional` **issuer**: *string*

The issuer string with which to sign and verify tokens by default.

Inherited from: [CommonClaimsOptions](commonclaimsoptions.md).[issuer](commonclaimsoptions.md#issuer)

Defined in: [src/types.ts:124](https://github.com/TomFrost/Embassy/blob/eff2681/src/types.ts#L124)

___

### key

• `Optional` **key**: *string*

The key to use to verify the token's signature. If omitted, Embassy will
look in the `keys` property passed to the constructor, or execute
`getPrivateKey` (for symmetric algorithms) or `getPublicKey`
(for asymmetric) if it's not found in `keys`.

Defined in: [src/types.ts:288](https://github.com/TomFrost/Embassy/blob/eff2681/src/types.ts#L288)

___

### maxAgeSecs

• `Optional` **maxAgeSecs**: *number*

If specified, will fail verification if the token is older than the
specified number of seconds

Defined in: [src/types.ts:269](https://github.com/TomFrost/Embassy/blob/eff2681/src/types.ts#L269)

___

### nonce

• `Optional` **nonce**: *string*

A nonce to be verified against the `nonce` claim. Useful for Open ID's ID
tokens.

Defined in: [src/types.ts:281](https://github.com/TomFrost/Embassy/blob/eff2681/src/types.ts#L281)
