/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

/**
 * Thrown when checking for or setting a scope name that cannot be resolved to
 * an index.
 *
 * Sets a `status` property to 403 so this error can be treated as an HTTP error
 * for convenience.
 */
export class ScopeNotFoundError extends Error {
  public status = 403

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
