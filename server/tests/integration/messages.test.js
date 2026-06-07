import './../setup.js';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { hash } from '../../src/utils/password.js';
import { prisma } from '../../src/config/prisma.js';
import { buildApp } from '../../src/index.js';

const app = buildApp();
const EMAIL = 'msg-test@example.com';
const PW = 'TestPass1234!';

before(async () => {
  await prisma.user.deleteMany({ where: { email: EMAIL } });
  await prisma.user.create({
    data: { email: EMAIL, passwordHash: await hash(PW, 4), role: 'ADMIN', active: true },
  });
});
after(async () => {
  await prisma.contactMessage.deleteMany({ where: { email: { contains: 'visitor-test' } } });
  await prisma.user.deleteMany({ where: { email: EMAIL } });
  await prisma.$disconnect();
});

describe('messages', () => {
  test('anonymous POST creates a message (kind CONTACT)', async () => {
    const r = await request(app)
      .post('/api/messages')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        kind: 'CONTACT',
        name: 'Visitor',
        email: `visitor-test-${Date.now()}@example.com`,
        message: 'Hello there',
      });
    assert.equal(r.status, 201);
    assert.equal(r.body.kind, 'CONTACT');
  });

  test('list requires auth', async () => {
    const r = await request(app).get('/api/messages');
    assert.equal(r.status, 401);
  });

  test('admin sees messages list', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: EMAIL, password: PW });
    const cookies = login.headers['set-cookie'];
    const list = await request(app)
      .get('/api/messages?take=5')
      .set('Cookie', cookies);
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.body.items));
  });
});
