import './../setup.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  signAccess, verifyAccess, signRefresh, verifyRefresh,
  hashToken, randomToken,
} from '../../src/utils/tokens.js';

describe('tokens', () => {
  test('signAccess → verifyAccess round-trip', () => {
    const access = signAccess({ sub: 'user-1', role: 'ADMIN' });
    const payload = verifyAccess(access);
    assert.equal(payload.sub, 'user-1');
    assert.equal(payload.role, 'ADMIN');
    assert.equal(payload.iss, 'endulus-travel');
    assert.equal(payload.aud, 'endulus-travel');
  });

  test('signRefresh → verifyRefresh round-trip', () => {
    const r = signRefresh({ sub: 'user-1', jti: 'abc' });
    const payload = verifyRefresh(r);
    assert.equal(payload.sub, 'user-1');
    assert.equal(payload.jti, 'abc');
  });

  test('verifyAccess rejects garbage', () => {
    assert.throws(() => verifyAccess('not.a.jwt'));
  });

  test('hashToken is deterministic', () => {
    assert.equal(hashToken('hello'), hashToken('hello'));
    assert.notEqual(hashToken('hello'), hashToken('world'));
    assert.equal(hashToken('hello').length, 64); // sha256 hex
  });

  test('randomToken is non-empty and hex', () => {
    const t = randomToken();
    assert.match(t, /^[0-9a-f]+$/);
    assert.ok(t.length >= 16);
  });
});
