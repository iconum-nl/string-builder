'use strict'

var Stream = require('stream').Stream

var StringBuilder = function StringBuilder (v, newline) {
  this.s = []
  this.append(v)
  Stream.call(this)

  if (newline === undefined) {
    var isWindows = process.platform === 'win32'
    this.newline = isWindows ? '\r\n' : '\n'
  } else {
    this.newline = newline
  }
}

StringBuilder.prototype.append = function (v) {
  if (v) {
    this.s.push(v)
  }
  return this
}

StringBuilder.prototype.appendLine = function (v) {
  this.s.push(this.newline)
  if (v) {
    this.s.push(v)
  }
  return this
}

StringBuilder.prototype.appendFormat = function () {
  var p = /({?){([^}]+)}(}?)/g
  var a = arguments
  var v = a[0]
  var o = false
  if (a.length === 2) {
    if (typeof a[1] === 'object' && a[1].constructor !== String) {
      a = a[1]
      o = true
    }
  }
  var s = v.split(p)
  var r = []
  for (var i = 0; i < s.length; i += 4) {
    r.push(s[i])
    if (s.length > i + 3) {
      if (s[i + 1] === '{' && s[i + 3] === '}') {
        r.push(s[i + 1], s[i + 2], s[i + 3])
      } else {
        r.push(s[i + 1], a[o ? s[i + 2] : parseInt(s[i + 2], 10) + 1], s[i + 3])
      }
    }
  }
  this.s.push(r.join(''))
}

StringBuilder.prototype.clear = function () {
  this.s.length = 0
}

StringBuilder.prototype.toString = function () {
  return this.s.length === 0 ? '' : this.s.join('')
}

module.exports = StringBuilder
