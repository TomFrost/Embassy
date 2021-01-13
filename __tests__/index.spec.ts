/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

import * as barrel from '../src'

describe('index', () => {
  it('exports Embassy', () => {
    expect(barrel.Embassy).toBeDefined()
  })
  it('exports Token', () => {
    expect(barrel.Token).toBeDefined()
  })
  it('exports errors', () => {
    expect(barrel.KeyNotFoundError).toBeDefined()
    expect(barrel.ScopeNotFoundError).toBeDefined()
    expect(barrel.TokenParseError).toBeDefined()
    expect(barrel.JsonWebTokenError).toBeDefined()
    expect(barrel.NotBeforeError).toBeDefined()
    expect(barrel.TokenExpiredError).toBeDefined()
  })
  it('exports algorithm lists', () => {
    expect(barrel.asymmetricAlgorithms).toBeDefined()
    expect(barrel.symmetricAlgorithms).toBeDefined()
  })
})
