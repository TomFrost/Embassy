/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

/**
 * Thrown when Token fails to parse a string token passed to its constructor.
 *
 * Sets a `status` property to 401 so this error can be treated as an HTTP error
 * for convenience.
 */
export class TokenParseError extends Error {
  public status = 401

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
