// Zod-powered request validation middleware.
//
// Replaces req.body/query/params with the parsed value. In Express 5 req.query
// became a read-only getter; we use defineProperty as a fallback. If BOTH
// assignment paths fail we throw — silently routing the unparsed input would
// be a security footgun.

const replaceField = (req, key, value) => {
  try {
    req[key] = value;
    if (req[key] !== value) {
      throw new Error(`req.${key} assignment did not stick`);
    }
    return;
  } catch {
    /* try defineProperty */
  }
  try {
    Object.defineProperty(req, key, {
      value,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    return;
  } catch (e) {
    throw new Error(`validate: cannot replace req.${key} (${e.message})`);
  }
};

export const validate = (schemas) => (req, _res, next) => {
  try {
    const validated = {};
    if (schemas.body) {
      const parsed = schemas.body.parse(req.body);
      replaceField(req, 'body', parsed);
      validated.body = parsed;
    }
    if (schemas.query) {
      const parsed = schemas.query.parse(req.query);
      replaceField(req, 'query', parsed);
      validated.query = parsed;
    }
    if (schemas.params) {
      const parsed = schemas.params.parse(req.params);
      replaceField(req, 'params', parsed);
      validated.params = parsed;
    }
    req.validated = validated;
    next();
  } catch (e) {
    next(e);
  }
};
