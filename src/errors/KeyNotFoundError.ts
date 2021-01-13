/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

/**
 * Thrown when attempting to sign or verify a token with an unknown key ID that
 * cannot be resolved to a key.
 *
 * Sets a `status` property to 401 so this error can be treated as an HTTP error
 * for convenience.
 */
export class KeyNotFoundError extends Error {
  public status = 401

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
