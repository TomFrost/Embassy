[embassy](../README.md) / [Exports](../modules.md) / TokenVerificationOptions

# Interface: TokenVerificationOptions

## Hierarchy

* *CommonClaimsOptions*

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

Defined in: [src/types.ts:269](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L269)

___

### audience

• `Optional` **audience**: *string*

The audience string with which to sign and verify tokens by default.

Defined in: [src/types.ts:130](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L130)

___

### clockToleranceSecs

• `Optional` **clockToleranceSecs**: *number*

The seconds of buffer to allow for differences between machine times when
verifying the token.

**`defaultvalue`** 5

Defined in: [src/types.ts:286](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L286)

___

### ignoreExpiration

• `Optional` **ignoreExpiration**: *boolean*

`true` to allow expired tokens to pass verification checks, `false`
otherwise

Defined in: [src/types.ts:274](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L274)

___

### issuer

• `Optional` **issuer**: *string*

The issuer string with which to sign and verify tokens by default.

Defined in: [src/types.ts:134](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L134)

___

### key

• `Optional` **key**: *string*

The key to use to verify the token's signature. If omitted, Embassy will
look in the `keys` property passed to the constructor, or execute
`getPrivateKey` (for symmetric algorithms) or `getPublicKey`
(for asymmetric) if it's not found in `keys`.

Defined in: [src/types.ts:298](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L298)

___

### maxAgeSecs

• `Optional` **maxAgeSecs**: *number*

If specified, will fail verification if the token is older than the
specified number of seconds

Defined in: [src/types.ts:279](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L279)

___

### nonce

• `Optional` **nonce**: *string*

A nonce to be verified against the `nonce` claim. Useful for Open ID's ID
tokens.

Defined in: [src/types.ts:291](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/types.ts#L291)
