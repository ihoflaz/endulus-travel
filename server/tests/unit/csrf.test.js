import './../setup.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { csrfGuard } from '../../src/middleware/csrf.js';

const run = (req) => new Promise((resolve) => {
  const res = {
    _status: 200,
    _body: null,
    status(c) { this._status = c; return this; },
    json(b) { this._body = b; resolve({ res: this, calledNext: false }); },
  };
  csrfGuard(req, res, () => resolve({ res, calledNext: true }));
});

describe('csrfGuard', () => {
  test('GET passes without XRW', async () => {
    const r = await run({ method: 'GET', headers: {}, cookies: {} });
    assert.equal(r.calledNext, true);
  });

  test('Bearer auth bypasses XRW requirement', async () => {
    const r = await run({
      method: 'POST',
      headers: { authorization: 'Bearer eyJ...' },
      cookies: {},
    });
    assert.equal(r.calledNext, true);
  });

  test('cookie auth without XRW is blocked (403)', async () => {
    const r = await run({
      method: 'POST',
      headers: {},
      cookies: { access_token: 'abc' },
    });
    assert.equal(r.res._status, 403);
  });

  test('refresh_token cookie alone is blocked (covers /auth/refresh CSRF)', async () => {
    const r = await run({
      method: 'POST',
      headers: {},
      cookies: { refresh_token: 'abc' },
    });
    assert.equal(r.res._status, 403);
  });

  test('cookie + XMLHttpRequest passes', async () => {
    const r = await run({
      method: 'POST',
      headers: { 'x-requested-with': 'XMLHttpRequest' },
      cookies: { access_token: 'abc' },
    });
    assert.equal(r.calledNext, true);
  });

  test('cookie + non-XHR XRW value is blocked', async () => {
    const r = await run({
      method: 'POST',
      headers: { 'x-requested-with': 'fetch' },
      cookies: { access_token: 'abc' },
    });
    assert.equal(r.res._status, 403);
  });

  test('cookie-less unauthenticated POST passes (e.g. /auth/login)', async () => {
    const r = await run({ method: 'POST', headers: {}, cookies: {} });
    assert.equal(r.calledNext, true);
  });
});
