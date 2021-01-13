[embassy](../README.md) / [Exports](../modules.md) / ScopeComponents

# Interface: ScopeComponents

## Hierarchy

* **ScopeComponents**

## Table of contents

### Properties

- [blob](scopecomponents.md#blob)
- [byte](scopecomponents.md#byte)
- [idx](scopecomponents.md#idx)
- [mask](scopecomponents.md#mask)
- [offset](scopecomponents.md#offset)

## Properties

### blob

• **blob**: *Uint8Array*

The full array of bytes defining this domain's scope blob

Defined in: [src/types.ts:51](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L51)

___

### byte

• **byte**: *number*

The individual target byte of the blob (same as `blob[offset]`)

Defined in: [src/types.ts:53](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L53)

___

### idx

• **idx**: *number*

The scope's index, from the domainScopes map

Defined in: [src/types.ts:47](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L47)

___

### mask

• **mask**: *number*

The bit mask targeting the individual scope bit in the provided byte

Defined in: [src/types.ts:55](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L55)

___

### offset

• **offset**: *number*

The index of the byte inside the blob that contains this scope's bit

Defined in: [src/types.ts:49](https://github.com/TomFrost/Embassy/blob/8146991/src/types.ts#L49)
