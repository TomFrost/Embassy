[embassy](../README.md) / [Exports](../modules.md) / EmbassyOptions

# Interface: EmbassyOptions

## Hierarchy

* [*ExpiringClaimsOptions*](expiringclaimsoptions.md)

  ↳ **EmbassyOptions**

  ↳↳ [*TokenOptions*](tokenoptions.md)

## Table of contents

### Properties

- [audience](embassyoptions.md#audience)
- [domainScopes](embassyoptions.md#domainscopes)
- [expiresInSecs](embassyoptions.md#expiresinsecs)
- [getPrivateKey](embassyoptions.md#getprivatekey)
- [getPublicKey](embassyoptions.md#getpublickey)
- [issuer](embassyoptions.md#issuer)
- [keys](embassyoptions.md#keys)
- [refreshScopes](embassyoptions.md#refreshscopes)
- [refreshScopesAfterMs](embassyoptions.md#refreshscopesafterms)

## Properties

### audience

• `Optional` **audience**: *string*

The audience string with which to sign and verify tokens by default.

Inherited from: [ExpiringClaimsOptions](expiringclaimsoptions.md).[audience](expiringclaimsoptions.md#audience)

Defined in: [src/types.ts:120](https://github.com/TomFrost/Embassy/blob/46b38ed/src/types.ts#L120)

___

### domainScopes

• `Optional` **domainScopes**: [*DomainScopeMap*](../modules.md#domainscopemap)

A mapping of domain to maps of scopes to their index under that name. For
example, if the "users" domain has "editSelf" and "editAll" scopes, the
domainScopes might appear as

```
{
  users: {
    editSelf: 0,
    editAll: 1
  }
}
```

The index of each scope within a domain should start at 0 and increment by
1 with every new scope, never repeating a number.

**`remarks`** 
Once an index has been set, it should never be changed as currently issued
and valid tokens refer to their scopes by index number. This format is used
so that scopes that become inapplicable after time can be deleted without
shifting the indexes of scopes that come after them.

Defined in: [src/types.ts:161](https://github.com/TomFrost/Embassy/blob/46b38ed/src/types.ts#L161)

___

### expiresInSecs

• `Optional` **expiresInSecs**: *number*

The number of seconds after which a newly signed token should expire, by
default.

**`defaultvalue`** 3600

Inherited from: [ExpiringClaimsOptions](expiringclaimsoptions.md).[expiresInSecs](expiringclaimsoptions.md#expiresinsecs)

Defined in: [src/types.ts:134](https://github.com/TomFrost/Embassy/blob/46b38ed/src/types.ts#L134)

___

### getPrivateKey

• `Optional` **getPrivateKey**: (`kid`: *string*) => [*PrivateKeyDefinition*](../modules.md#privatekeydefinition) \| *Promise*<[*PrivateKeyDefinition*](../modules.md#privatekeydefinition)\>

A function to be called when attempting to use a currently-unknown key ID
to either:

- Sign a Token
- Verify a Token that was signed using a shared-secret symmetric algorithm
  in the HMAC family

The function takes a key ID and should return or resolve to a
`PrivateKeyDefinition` with the `algorithm` of the key, and a `privateKey`
property with either the PEM-formatted asymmetric key or shared secret.

**`param`** The ID of the key to be retrieved

**`returns`** A private key definition for the supplied `kid`, or a promise that
resolves to one.

Defined in: [src/types.ts:205](https://github.com/TomFrost/Embassy/blob/46b38ed/src/types.ts#L205)

___

### getPublicKey

• `Optional` **getPublicKey**: (`kid`: *string*) => *string* \| *Promise*<*string*\>

A function to be called when attempting to verify a token that was
signed with a currently-unknown key ID using an asymmetric algorithm. It
takes the key ID as its only argument, and must return a PEM-formatted
public key.

**`remarks`** 
When verifying a token signed with HMAC, `getPrivateKey` is used since
symmetric keys should never be considered "public". This distinction is
made automatically based on the algorithm header of the token being
verified.

**`param`** The ID of the key to be retrieved

**`returns`** The PEM-encoded public key associated with the supplied `kid`.

Defined in: [src/types.ts:223](https://github.com/TomFrost/Embassy/blob/46b38ed/src/types.ts#L223)

___

### issuer

• `Optional` **issuer**: *string*

The issuer string with which to sign and verify tokens by default.

Inherited from: [ExpiringClaimsOptions](expiringclaimsoptions.md).[issuer](expiringclaimsoptions.md#issuer)

Defined in: [src/types.ts:124](https://github.com/TomFrost/Embassy/blob/46b38ed/src/types.ts#L124)

___

### keys

• `Optional` **keys**: *Record*<*string*, [*KeyDefinition*](../modules.md#keydefinition)\>

A mapping of key IDs to KeyDefinitions to check initially before any calls
to find external keys are made.

**`remarks`** 
**IMPORTANT NOTE:** This object will be mutated in order to cache keys for
future token signing and verification. If it's important that the original
object remain unmodified, clone it before passing it in.

Defined in: [src/types.ts:171](https://github.com/TomFrost/Embassy/blob/46b38ed/src/types.ts#L171)

___

### refreshScopes

• `Optional` **refreshScopes**: () => [*DomainScopeMap*](../modules.md#domainscopemap) \| *Promise*<[*DomainScopeMap*](../modules.md#domainscopemap)\>

A function to update (or retrieve for the first time) the domainScopes map.
When a scope is requested that does not exist in the currently known map,
this function will be called to update the map and look for the scope
before giving up and throwing an Error. Must return, or resolve to, a new
`DomainScopeMap`.

Defined in: [src/types.ts:179](https://github.com/TomFrost/Embassy/blob/46b38ed/src/types.ts#L179)

___

### refreshScopesAfterMs

• `Optional` **refreshScopesAfterMs**: *number*

The number of milliseconds that must pass before the scopes can be
refreshed again. If `refreshScopes` is called and a new, unknown scope
is encountered within this amount of time from that call, an Error will be
thrown rather than refreshing the scopes.

**`defaultvalue`** 1000

Defined in: [src/types.ts:188](https://github.com/TomFrost/Embassy/blob/46b38ed/src/types.ts#L188)
