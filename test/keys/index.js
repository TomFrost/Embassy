/*
 * Embassy
 * Copyright (c) 2017-2018 Tom Shawver
 */

'use strict'

const fs = require('fs')
const path = require('path')

exports.priv = fs.readFileSync(path.resolve('test/keys/test.priv.pem'))
exports.pub = fs.readFileSync(path.resolve('test/keys/test.pub.pem'))
