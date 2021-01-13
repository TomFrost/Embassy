[embassy](../README.md) / [Exports](../modules.md) / NotBeforeError

# Class: NotBeforeError

Thrown if current time is before the nbf claim.

## Hierarchy

* [*JsonWebTokenError*](jsonwebtokenerror.md)

  ↳ **NotBeforeError**

## Table of contents

### Constructors

- [constructor](notbeforeerror.md#constructor)

### Properties

- [date](notbeforeerror.md#date)
- [inner](notbeforeerror.md#inner)
- [message](notbeforeerror.md#message)
- [name](notbeforeerror.md#name)
- [prepareStackTrace](notbeforeerror.md#preparestacktrace)
- [stack](notbeforeerror.md#stack)
- [stackTraceLimit](notbeforeerror.md#stacktracelimit)

### Methods

- [captureStackTrace](notbeforeerror.md#capturestacktrace)

## Constructors

### constructor

\+ **new NotBeforeError**(`message`: *string*, `date`: Date): [*NotBeforeError*](notbeforeerror.md)

#### Parameters:

Name | Type |
------ | ------ |
`message` | *string* |
`date` | Date |

**Returns:** [*NotBeforeError*](notbeforeerror.md)

Inherited from: [JsonWebTokenError](jsonwebtokenerror.md)

Defined in: node_modules/@types/jsonwebtoken/index.d.ts:34

## Properties

### date

• **date**: Date

Defined in: node_modules/@types/jsonwebtoken/index.d.ts:34

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
