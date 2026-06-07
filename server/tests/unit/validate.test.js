import './../setup.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { validate } from '../../src/middleware/validate.js';

const run = (req, schemas) => new Promise((resolve) => {
  validate(schemas)(req, {}, (err) => resolve({ req, err }));
});

describe('validate middleware', () => {
  test('replaces body with parsed object', async () => {
    const req = { body: { age: '42' } };
    const { req: out, err } = await run(req, {
      body: z.object({ age: z.coerce.number() }),
    });
    assert.equal(err, undefined);
    assert.equal(out.body.age, 42);
    assert.equal(out.validated.body.age, 42);
  });

  test('passes ZodError when invalid', async () => {
    const { err } = await run({ body: {} }, {
      body: z.object({ name: z.string() }),
    });
    assert.equal(err?.name, 'ZodError');
  });

  test('strict schema rejects unknown keys', async () => {
    const { err } = await run({ body: { a: 1, evil: 'x' } }, {
      body: z.object({ a: z.number() }).strict(),
    });
    assert.equal(err?.name, 'ZodError');
  });
});
