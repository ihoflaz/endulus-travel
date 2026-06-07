// Shared test bootstrap. Provides:
//  - dotenv from tests/.env.test (gitignored fallback to in-process defaults)
//  - JWT secrets so env.js doesn't bail out on import
//  - DATABASE_URL pointed at the same Postgres the dev stack uses unless
//    overridden.

if (!process.env.JWT_ACCESS_SECRET) {
  process.env.JWT_ACCESS_SECRET = 'test_access_secret_'.padEnd(48, 'x');
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_'.padEnd(48, 'y');
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://endulus:endulus_dev_pw@localhost:5435/endulus?schema=public';
}
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.RUN_SEED = 'false';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'test-admin@endulustravel.com';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TestAdmin1234!';
process.env.BCRYPT_ROUNDS = '4'; // fast for tests
process.env.MORGAN_ENABLED = 'false';
process.env.CORS_ORIGIN = 'http://localhost:3000,http://localhost:8080';
