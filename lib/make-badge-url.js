'use strict'

const queryString = require('query-string')
const pathToRegexp = require('path-to-regexp')

function encodeField(s) {
  return encodeURIComponent(s.replace(/-/g, '--').replace(/_/g, '__'))
}

function staticBadgeUrl({
  baseUrl,
  label,
  message,
  color = 'lightgray',
  style,
  format = 'svg',
}) {
  if (!label || !message) {
    throw Error('label and message are required')
  }
  const path = [label, message, color].map(encodeField).join('-')
  const outQueryString = queryString.stringify({
    style,
  })
  const suffix = outQueryString ? `?${outQueryString}` : ''
  return `/badge/${path}.${format}${suffix}`
}

function makeFullPattern({ base, pattern }) {
  if (base) {
    pattern = [base, pattern].join('/')
  }
  return `/${pattern}.:ext(svg|png|gif|jpg|json)`
}

function makeBadgeUrlFromPattern({ base, pattern, namedParams, ext = 'svg' }) {
  const fullPattern = makeFullPattern({ base, pattern })
  const toPath = pathToRegexp.compile(fullPattern, {
    strict: true,
    sensitive: true,
  })
  return toPath({ ext, ...namedParams })
}

module.exports = {
  encodeField,
  staticBadgeUrl,
  makeBadgeUrlFromPattern,
}
