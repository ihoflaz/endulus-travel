import './../setup.js';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { hash } from '../../src/utils/password.js';
import { prisma } from '../../src/config/prisma.js';
import { buildApp } from '../../src/index.js';

const app = buildApp();

const TEST_EMAIL = 'auth-test@example.com';
const TEST_PASSWORD = 'TestPass1234!';

before(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  const passwordHash = await hash(TEST_PASSWORD, 4);
  await prisma.user.create({
    data: { email: TEST_EMAIL, passwordHash, role: 'EDITOR', active: true },
  });
});

after(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});

describe('auth flow', () => {
  test('login → cookies set, no tokens in body, /me works', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    assert.equal(login.status, 200);
    assert.equal(login.body.user?.email, TEST_EMAIL);
    assert.equal(login.body.access, undefined, 'access token leaked in body');
    assert.equal(login.body.refresh, undefined, 'refresh token leaked in body');

    const cookies = login.headers['set-cookie'] || [];
    assert.ok(cookies.some((c) => c.startsWith('access_token=')));
    assert.ok(cookies.some((c) => c.startsWith('refresh_token=')));

    const me = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookies);
    assert.equal(me.status, 200);
    assert.equal(me.body.user?.email, TEST_EMAIL);
  });

  test('wrong password → 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: TEST_EMAIL, password: 'wrongpassword' });
    assert.equal(res.status, 401);
  });

  test('refresh requires XRW header (CSRF)', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    const cookies = login.headers['set-cookie'];

    const noXrw = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookies);
    assert.equal(noXrw.status, 403);

    const withXrw = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookies)
      .set('X-Requested-With', 'XMLHttpRequest');
    assert.equal(withXrw.status, 200);
  });

  test('refresh token reuse detection', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    const oldCookies = login.headers['set-cookie'];

    const first = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', oldCookies)
      .set('X-Requested-With', 'XMLHttpRequest');
    assert.equal(first.status, 200);

    // Replay the OLD refresh cookie — must be detected as reuse
    const replay = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', oldCookies)
      .set('X-Requested-With', 'XMLHttpRequest');
    assert.equal(replay.status, 401);
    assert.match(replay.body.error || '', /reuse/i);
  });

  test('settings allowlist: PUT unknown key → 400', async () => {
    // Need admin user
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    const cookies = adminLogin.headers['set-cookie'];
    const bad = await request(app)
      .put('/api/settings/random-key')
      .set('Cookie', cookies)
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ foo: 'bar' });
    assert.equal(bad.status, 400);
  });
});
