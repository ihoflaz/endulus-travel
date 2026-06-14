// Thin nodemailer wrapper. Reads SMTP creds from env; silently no-ops when
// SMTP_HOST is empty so dev environments don't need a real mail server.
// Two convenience helpers cover the only two flows we currently need:
//   - sendOpsNotification: alerts the in-house team when a new message lands
//   - sendVisitorAck:      thanks the visitor and sets expectation
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_SECURE = (process.env.SMTP_SECURE || '').toLowerCase() === 'true';
const MAIL_FROM = process.env.MAIL_FROM || 'Endülüs Travel <info@endulustravel.com>';
const OPS_EMAIL = process.env.OPS_EMAIL || '';

let transporter = null;
let transporterReason = null;

const getTransporter = () => {
  if (transporter || transporterReason) return transporter;
  if (!SMTP_HOST) {
    transporterReason = 'SMTP_HOST not set — mailer is disabled';
    console.warn('[mailer]', transporterReason);
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE || SMTP_PORT === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
};

export const mailerStatus = () => ({
  enabled: !!SMTP_HOST,
  reason: transporterReason,
  from: MAIL_FROM,
  ops: OPS_EMAIL,
});

const safeSend = async (opts) => {
  const tx = getTransporter();
  if (!tx) return false;
  try {
    await tx.sendMail(opts);
    return true;
  } catch (e) {
    console.error('[mailer] sendMail failed:', e?.message);
    return false;
  }
};

// Notify the operations mailbox that a new lead/contact arrived.
export const sendOpsNotification = async ({ kind, name, email, phone, subject, message, meta } = {}) => {
  if (!OPS_EMAIL) return false;
  const summary = [
    `Tür: ${kind || 'CONTACT'}`,
    `Gönderen: ${name || '—'} <${email}>`,
    phone ? `Telefon: ${phone}` : null,
    subject ? `Konu: ${subject}` : null,
    message ? `Mesaj:\n${message}` : null,
    meta ? `Form detayları:\n${JSON.stringify(meta, null, 2)}` : null,
  ].filter(Boolean).join('\n\n');
  return safeSend({
    from: MAIL_FROM,
    to: OPS_EMAIL,
    replyTo: email || undefined,
    subject: `[Endülüs ${kind || 'CONTACT'}] ${subject || name || 'Yeni mesaj'}`,
    text: summary,
  });
};

// Thanks the visitor and sets a response-time expectation.
export const sendVisitorAck = async ({ kind, name, email } = {}) => {
  if (!email) return false;
  const labels = { CONTACT: 'mesajınızı', OFFER: 'teklif talebinizi', SURVEY: 'ön anketinizi' };
  const what = labels[kind] || 'mesajınızı';
  const body = [
    `Merhaba ${name || ''},`,
    '',
    `${what} aldık. Ekibimiz mesai saatleri içinde (Pzt-Cum 09:00-18:00) en kısa sürede size geri dönecektir.`,
    '',
    'Acil bir konu için WhatsApp üzerinden de yazabilirsiniz: https://wa.me/905079384508',
    '',
    'Endülüs Travel',
    'ROTA ATLAS TURİZM SEYAHAT ACENTASI · TURSAB No: 6739',
  ].join('\n');
  return safeSend({
    from: MAIL_FROM,
    to: email,
    subject: 'Endülüs Travel — mesajınızı aldık',
    text: body,
  });
};
