import './../setup.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audit } from '../../src/utils/audit.js';

// audit() must never throw — broken logging should not break the request.
test('audit swallows errors silently', async () => {
  // No prisma connection inside this test — call with a request that has no
  // user; audit() will attempt to write to DB. If postgres is unreachable
  // it should still resolve successfully.
  await assert.doesNotReject(audit(
    { user: null, ip: '127.0.0.1', headers: {} },
    { action: 'test', entity: 'Test' }
  ));
});
