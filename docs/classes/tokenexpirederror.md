[embassy](../README.md) / [Exports](../modules.md) / TokenExpiredError

# Class: TokenExpiredError

## Hierarchy

* [*JsonWebTokenError*](jsonwebtokenerror.md)

  ↳ **TokenExpiredError**

## Table of contents

### Constructors

- [constructor](tokenexpirederror.md#constructor)

### Properties

- [expiredAt](tokenexpirederror.md#expiredat)
- [inner](tokenexpirederror.md#inner)
- [message](tokenexpirederror.md#message)
- [name](tokenexpirederror.md#name)
- [prepareStackTrace](tokenexpirederror.md#preparestacktrace)
- [stack](tokenexpirederror.md#stack)
- [stackTraceLimit](tokenexpirederror.md#stacktracelimit)

### Methods

- [captureStackTrace](tokenexpirederror.md#capturestacktrace)

## Constructors

### constructor

\+ **new TokenExpiredError**(`message`: *string*, `expiredAt`: Date): [*TokenExpiredError*](tokenexpirederror.md)

#### Parameters:

Name | Type |
------ | ------ |
`message` | *string* |
`expiredAt` | Date |

**Returns:** [*TokenExpiredError*](tokenexpirederror.md)

Inherited from: [JsonWebTokenError](jsonwebtokenerror.md)

Defined in: node_modules/@types/jsonwebtoken/index.d.ts:25

## Properties

### expiredAt

• **expiredAt**: Date

Defined in: node_modules/@types/jsonwebtoken/index.d.ts:25

___

### inner

• **inner**: Error

Inherited from: [JsonWebTokenError](jsonwebtokenerror.md).[inner](jsonwebtokenerror.md#inner)

Defined in: node_modules/@types/jsonwebtoken/index.d.ts:19

___

### message

• **message**: *string*

Inherited from: [JsonWebTokenError](jsonwebtokenerror.md).[message](jsonwebtokenerror.md#message)

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: *string*

Inherited from: [JsonWebTokenError](jsonwebtokenerror.md).[name](jsonwebtokenerror.md#name)

Defined in: node_modules/typescript/lib/lib.es5.d.ts:973

___

### prepareStackTrace

• `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

Inherited from: [JsonWebTokenError](jsonwebtokenerror.md).[prepareStackTrace](jsonwebtokenerror.md#preparestacktrace)

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stack

• `Optional` **stack**: *string*

Inherited from: [JsonWebTokenError](jsonwebtokenerror.md).[stack](jsonwebtokenerror.md#stack)

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

___

### stackTraceLimit

• **stackTraceLimit**: *number*

Inherited from: [JsonWebTokenError](jsonwebtokenerror.md).[stackTraceLimit](jsonwebtokenerror.md#stacktracelimit)

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

Inherited from: [JsonWebTokenError](jsonwebtokenerror.md)

Defined in: node_modules/@types/node/globals.d.ts:4
