// Convert CORS rejections (thrown as plain Error by the cors lib) into a
// proper 403 instead of leaking through to the 500 catch-all.
export const corsErrorHandler = (err, _req, res, next) => {
  if (err && typeof err.message === 'string' && /not allowed by CORS|Origin.*not allowed/i.test(err.message)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  return next(err);
};
