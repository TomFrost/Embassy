[embassy](../README.md) / [Exports](../modules.md) / ScopeNotFoundError

# Class: ScopeNotFoundError

Thrown when checking for or setting a scope name that cannot be resolved to
an index.

Sets a `status` property to 403 so this error can be treated as an HTTP error
for convenience.

## Hierarchy

* *Error*

  ↳ **ScopeNotFoundError**

## Table of contents

### Constructors

- [constructor](scopenotfounderror.md#constructor)

### Properties

- [message](scopenotfounderror.md#message)
- [name](scopenotfounderror.md#name)
- [prepareStackTrace](scopenotfounderror.md#preparestacktrace)
- [stack](scopenotfounderror.md#stack)
- [stackTraceLimit](scopenotfounderror.md#stacktracelimit)
- [status](scopenotfounderror.md#status)

### Methods

- [captureStackTrace](scopenotfounderror.md#capturestacktrace)

## Constructors

### constructor

\+ **new ScopeNotFoundError**(`message`: *string*): [*ScopeNotFoundError*](scopenotfounderror.md)

#### Parameters:

Name | Type |
------ | ------ |
`message` | *string* |

**Returns:** [*ScopeNotFoundError*](scopenotfounderror.md)

Defined in: [src/errors/ScopeNotFoundError.ts:14](https://github.com/TomFrost/Embassy/blob/46b38ed/src/errors/ScopeNotFoundError.ts#L14)

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

• **status**: *number*= 403

Defined in: [src/errors/ScopeNotFoundError.ts:14](https://github.com/TomFrost/Embassy/blob/46b38ed/src/errors/ScopeNotFoundError.ts#L14)

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
