[embassy](../README.md) / [Exports](../modules.md) / JsonWebTokenError

# Class: JsonWebTokenError

## Hierarchy

* *Error*

  ↳ **JsonWebTokenError**

  ↳↳ [*TokenExpiredError*](tokenexpirederror.md)

## Table of contents

### Constructors

- [constructor](jsonwebtokenerror.md#constructor)

### Properties

- [inner](jsonwebtokenerror.md#inner)
- [message](jsonwebtokenerror.md#message)
- [name](jsonwebtokenerror.md#name)
- [prepareStackTrace](jsonwebtokenerror.md#preparestacktrace)
- [stack](jsonwebtokenerror.md#stack)
- [stackTraceLimit](jsonwebtokenerror.md#stacktracelimit)

### Methods

- [captureStackTrace](jsonwebtokenerror.md#capturestacktrace)

## Constructors

### constructor

\+ **new JsonWebTokenError**(`message`: *string*, `error?`: Error): [*JsonWebTokenError*](jsonwebtokenerror.md)

#### Parameters:

Name | Type |
------ | ------ |
`message` | *string* |
`error?` | Error |

**Returns:** [*JsonWebTokenError*](jsonwebtokenerror.md)

Defined in: node_modules/@types/jsonwebtoken/index.d.ts:19

## Properties

### inner

• **inner**: Error

Defined in: node_modules/@types/jsonwebtoken/index.d.ts:19

___

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
