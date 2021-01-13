[embassy](../README.md) / [Exports](../modules.md) / KeyNotFoundError

# Class: KeyNotFoundError

Thrown when attempting to sign or verify a token with an unknown key ID that
cannot be resolved to a key.

Sets a `status` property to 401 so this error can be treated as an HTTP error
for convenience.

## Hierarchy

* *Error*

  ↳ **KeyNotFoundError**

## Table of contents

### Constructors

- [constructor](keynotfounderror.md#constructor)

### Properties

- [message](keynotfounderror.md#message)
- [name](keynotfounderror.md#name)
- [prepareStackTrace](keynotfounderror.md#preparestacktrace)
- [stack](keynotfounderror.md#stack)
- [stackTraceLimit](keynotfounderror.md#stacktracelimit)
- [status](keynotfounderror.md#status)

### Methods

- [captureStackTrace](keynotfounderror.md#capturestacktrace)

## Constructors

### constructor

\+ **new KeyNotFoundError**(`message`: *string*): [*KeyNotFoundError*](keynotfounderror.md)

#### Parameters:

Name | Type |
------ | ------ |
`message` | *string* |

**Returns:** [*KeyNotFoundError*](keynotfounderror.md)

Defined in: [src/errors/KeyNotFoundError.ts:14](https://github.com/TomFrost/Embassy/blob/eff2681/src/errors/KeyNotFoundError.ts#L14)

## Properties

### message

• **message**: *string*

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: *string*

Defined in: node_modules/typescript/lib/lib.es5.d.ts:973

___

### prepareStackTrace

• `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stack

• `Optional` **stack**: *string*

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

___

### stackTraceLimit

• **stackTraceLimit**: *number*

Defined in: node_modules/@types/node/globals.d.ts:13

___

### status

• **status**: *number*= 401

Defined in: [src/errors/KeyNotFoundError.ts:14](https://github.com/TomFrost/Embassy/blob/eff2681/src/errors/KeyNotFoundError.ts#L14)

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

Name | Type |
------ | ------ |
`targetObject` | *object* |
`constructorOpt?` | Function |

**Returns:** *void*

Defined in: node_modules/@types/node/globals.d.ts:4
