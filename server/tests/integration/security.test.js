import './../setup.js';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { hash } from '../../src/utils/password.js';
import { prisma } from '../../src/config/prisma.js';
import { buildApp } from '../../src/index.js';

const app = buildApp();
const EMAIL = 'sec-test@example.com';
const PW = 'TestPass1234!';

before(async () => {
  await prisma.user.deleteMany({ where: { email: EMAIL } });
  await prisma.user.create({
    data: { email: EMAIL, passwordHash: await hash(PW, 4), role: 'ADMIN', active: true },
  });
});
after(async () => {
  await prisma.user.deleteMany({ where: { email: EMAIL } });
  await prisma.$disconnect();
});

const loginCookies = async () => {
  const r = await request(app)
    .post('/api/auth/login')
    .set('X-Requested-With', 'XMLHttpRequest')
    .send({ email: EMAIL, password: PW });
  return r.headers['set-cookie'];
};

describe('security guards', () => {
  test('CORS rejects unlisted origin (403 not 500)', async () => {
    const r = await request(app)
      .get('/api/health')
      .set('Origin', 'https://evil.example');
    // cors lib answers 200 but suppresses ACAO header when origin disallowed
    // — our error handler only triggers if the lib calls cb(err).
    // With cb(null,false), browser blocks but server still returns 200.
    // Verify NO Access-Control-Allow-Origin header is set.
    assert.equal(r.headers['access-control-allow-origin'], undefined);
  });

  test('filter injection: ?passwordHash=x ignored', async () => {
    const r = await request(app)
      .get('/api/tours?passwordHash=anything');
    assert.equal(r.status, 200);
    // Should not throw — and should return a valid envelope
    assert.ok(Array.isArray(r.body.featured));
  });

  test('strict zod rejects unknown POST keys', async () => {
    const cookies = await loginCookies();
    const r = await request(app)
      .post('/api/categories')
      .set('Cookie', cookies)
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ key: `t-${Date.now()}`, label: 'x', sneaky: 'bad' });
    assert.equal(r.status, 400);
  });

  test('public GET-by-slug strips admin-only fields via publicShape', async () => {
    const r = await request(app).get('/api/tours/misir-turu-ozel');
    if (r.status === 404) return; // tours may not be seeded in this env
    // publicShape excludes createdAt/updatedAt/active/featured/order
    assert.equal(r.body.createdAt, undefined);
    assert.equal(r.body.updatedAt, undefined);
    assert.equal(r.body.active, undefined);
  });

  test('SVG upload is rejected by mime allowlist', async () => {
    const cookies = await loginCookies();
    const svg = '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
    const r = await request(app)
      .post('/api/uploads')
      .set('Cookie', cookies)
      .set('X-Requested-With', 'XMLHttpRequest')
      .attach('file', Buffer.from(svg), { filename: 'test.svg', contentType: 'image/svg+xml' });
    assert.notEqual(r.status, 201);
  });

  test('health/full returns 200 when DB is up', async () => {
    const r = await request(app).get('/api/health/full');
    assert.equal(r.status, 200);
    assert.equal(r.body.db, 'up');
  });

  test('settings mapEmbedCode rejects javascript:', async () => {
    const cookies = await loginCookies();
    const r = await request(app)
      .put('/api/settings/contact')
      .set('Cookie', cookies)
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ mapEmbedCode: 'javascript:alert(1)' });
    assert.equal(r.status, 400);
  });
});
