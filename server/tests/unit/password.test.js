import './../setup.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { hash, compare, passwordSchema } from '../../src/utils/password.js';

describe('password utility', () => {
  test('hash and compare round-trip', async () => {
    const h = await hash('Secret1234!', 4);
    assert.ok(await compare('Secret1234!', h));
    assert.equal(await compare('wrong', h), false);
  });

  test('passwordSchema rejects short / no-digit / no-symbol', () => {
    assert.throws(() => passwordSchema.parse('short'));
    assert.throws(() => passwordSchema.parse('AllLetters!'));
    assert.throws(() => passwordSchema.parse('NoSymbol123'));
    assert.throws(() => passwordSchema.parse('123456789!')); // no letter
  });

  test('passwordSchema accepts strong password', () => {
    assert.equal(passwordSchema.parse('GoodPass1!'), 'GoodPass1!');
  });
});
