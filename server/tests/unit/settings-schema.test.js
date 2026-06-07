import './../setup.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SETTING_SCHEMAS, ALLOWED_SETTING_KEYS } from '../../src/routes/settings.js';

describe('SETTING_SCHEMAS', () => {
  test('allowlist contains expected keys', () => {
    for (const k of ['about', 'contact', 'hero.slogan', 'site', 'footer', 'whatsapp']) {
      assert.ok(ALLOWED_SETTING_KEYS.has(k), `missing key ${k}`);
    }
  });

  test('mapEmbedCode accepts Google Maps embed URL', () => {
    const r = SETTING_SCHEMAS.contact.safeParse({
      mapEmbedCode: 'https://www.google.com/maps/embed?pb=test',
    });
    assert.equal(r.success, true);
  });

  test('mapEmbedCode rejects javascript: URL', () => {
    const r = SETTING_SCHEMAS.contact.safeParse({
      mapEmbedCode: 'javascript:alert(1)',
    });
    assert.equal(r.success, false);
  });

  test('contact strict mode rejects unknown keys', () => {
    const r = SETTING_SCHEMAS.contact.safeParse({
      address: 'X',
      backdoor: 'oops',
    });
    assert.equal(r.success, false);
  });

  test('social URL rejects javascript:', () => {
    const r = SETTING_SCHEMAS.contact.safeParse({
      social: { facebook: 'javascript:alert(1)' },
    });
    assert.equal(r.success, false);
  });

  test('legal.privacy rejects <script>', () => {
    const r = SETTING_SCHEMAS['legal.privacy'].safeParse({
      title: 'X', body: '<p>OK</p><script>bad</script>',
    });
    assert.equal(r.success, false);
  });
});
