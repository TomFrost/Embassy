[embassy](../README.md) / [Exports](../modules.md) / TokenParseError

# Class: TokenParseError

Thrown when Token fails to parse a string token passed to its constructor.

Sets a `status` property to 401 so this error can be treated as an HTTP error
for convenience.

## Hierarchy

* *Error*

  ↳ **TokenParseError**

## Table of contents

### Constructors

- [constructor](tokenparseerror.md#constructor)

### Properties

- [message](tokenparseerror.md#message)
- [name](tokenparseerror.md#name)
- [prepareStackTrace](tokenparseerror.md#preparestacktrace)
- [stack](tokenparseerror.md#stack)
- [stackTraceLimit](tokenparseerror.md#stacktracelimit)
- [status](tokenparseerror.md#status)

### Methods

- [captureStackTrace](tokenparseerror.md#capturestacktrace)

## Constructors

### constructor

\+ **new TokenParseError**(`message`: *string*): [*TokenParseError*](tokenparseerror.md)

#### Parameters:

Name | Type |
------ | ------ |
`message` | *string* |

**Returns:** [*TokenParseError*](tokenparseerror.md)

Defined in: [src/errors/TokenParseError.ts:13](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/errors/TokenParseError.ts#L13)

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

Defined in: [src/errors/TokenParseError.ts:13](https://github.com/TomFrost/Embassy/blob/3a9cf3a/src/errors/TokenParseError.ts#L13)

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
