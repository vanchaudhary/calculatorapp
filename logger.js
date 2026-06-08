'use strict';

function sanitize(context) {
  if (!context || typeof context !== 'object') return {};
  const forbidden = new Set(['password', 'token', 'authorization', 'ssn', 'email']);
  const out = {};
  for (const [k, v] of Object.entries(context)) {
    if (!forbidden.has(k)) out[k] = v;
  }
  return out;
}

function write(level, event, context = {}, requestId = null) {
  const payload = {
    level,
    event,
    ...(requestId ? { requestId } : {}),
    ...sanitize(context),
    timestamp: new Date().toISOString(),
  };
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

module.exports = {
  info(event, context = {}, requestId = null) {
    write('info', event, context, requestId);
  },
  warn(event, context = {}, requestId = null) {
    write('warn', event, context, requestId);
  },
  error(event, context = {}, requestId = null) {
    write('error', event, context, requestId);
  }
};