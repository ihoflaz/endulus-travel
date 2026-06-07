// Thin wrapper around @node-rs/bcrypt so we expose the bcryptjs-shaped API
// the rest of the codebase already uses (`hash` + `compare`). @node-rs is
// ~6× faster than bcryptjs and ships prebuilt alpine binaries.
import { hash as rsHash, verify as rsVerify } from '@node-rs/bcrypt';
import { z } from 'zod';

export const hash = (plaintext, rounds = 12) => rsHash(plaintext, rounds);

export const compare = (plaintext, storedHash) => rsVerify(plaintext, storedHash);

// Server-side password policy. Tuned for admin panel — not consumer-facing.
// Min 10 chars, at least one letter, one digit, one special character.
export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(128, 'Password too long')
  .refine((v) => /[A-Za-z]/.test(v), 'Password must contain a letter')
  .refine((v) => /\d/.test(v), 'Password must contain a digit')
  .refine(
    (v) => /[^A-Za-z0-9]/.test(v),
    'Password must contain a symbol'
  );
