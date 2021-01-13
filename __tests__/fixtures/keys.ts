/*
 * Embassy
 * Copyright (c) 2017-2021 Tom Shawver
 */

import fs from 'fs'
import path from 'path'

export const priv = fs.readFileSync(
  path.resolve(__dirname, './test.priv.pem'),
  {
    encoding: 'utf8'
  }
)
export const pub = fs.readFileSync(path.resolve(__dirname, './test.pub.pem'), {
  encoding: 'utf8'
})
