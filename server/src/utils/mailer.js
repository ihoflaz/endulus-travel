// Thin nodemailer wrapper. Reads SMTP creds from env; silently no-ops when
// SMTP_HOST is empty so dev environments don't need a real mail server.
// Two convenience helpers cover the only two flows we currently need:
//   - sendOpsNotification: alerts the in-house team when a new message lands
//   - sendVisitorAck:      thanks the visitor and sets expectation
// Both send a cinematic dark/gold HTML part (with the animated logo) plus a
// plain-text fallback for clients that don't render HTML.
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_SECURE = (process.env.SMTP_SECURE || '').toLowerCase() === 'true';
const MAIL_FROM = process.env.MAIL_FROM || 'Endülüs Travel <info@endulustravel.com>';
const OPS_EMAIL = process.env.OPS_EMAIL || '';
const SITE_URL = (process.env.SITE_URL || 'https://endulustravel.com').replace(/\/$/, '');
const LOGO_GIF = `${SITE_URL}/uploads/media/logo-anim.gif`;
const WA_URL = 'https://wa.me/905079384508';
const IG_URL = 'https://www.instagram.com/endulustravell/';

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

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Brand palette
const BG = '#06080f';
const CARD = '#0f1422';
const LINE = 'rgba(217,178,90,0.22)';
const GOLD = '#d9b25a';
const GOLD_BR = '#f0cf8b';
const TEXT = '#e8e2d3';
const MUTED = '#8d8775';

// Email shell — table layout, inline styles, dark/gold, animated-logo header.
const shell = ({ preheader = '', heading, intro, bodyHtml = '', cta }) => `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><meta name="supported-color-schemes" content="dark light"></head>
<body style="margin:0;padding:0;background:${BG};">
<span style="display:none!important;opacity:0;color:${BG};height:0;width:0;overflow:hidden;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:28px 12px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
      <tr><td align="center" style="padding:8px 0 22px;">
        <img src="${LOGO_GIF}" width="300" alt="Endülüs Travel" style="display:block;width:300px;max-width:80%;height:auto;border:0;" />
      </td></tr>
      <tr><td style="background:${CARD};border:1px solid ${LINE};border-radius:20px;padding:38px 34px;">
        <div style="width:54px;height:2px;background:${GOLD};margin:0 auto 24px;"></div>
        <h1 style="margin:0 0 16px;text-align:center;font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:26px;line-height:1.25;color:${GOLD_BR};">${esc(heading)}</h1>
        ${intro ? `<p style="margin:0 0 22px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${TEXT};">${intro}</p>` : ''}
        ${bodyHtml}
        ${cta ? `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto 6px;"><tr><td align="center" bgcolor="${GOLD}" style="border-radius:999px;">
          <a href="${esc(cta.href)}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#1a1206;text-decoration:none;border-radius:999px;">${esc(cta.label)}</a>
        </td></tr></table>` : ''}
      </td></tr>
      <tr><td style="padding:24px 18px 6px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:${MUTED};">
        <a href="${SITE_URL}" style="color:${GOLD};text-decoration:none;">endulustravel.com</a>
        &nbsp;·&nbsp; <a href="${WA_URL}" style="color:${GOLD};text-decoration:none;">WhatsApp</a>
        &nbsp;·&nbsp; <a href="${IG_URL}" style="color:${GOLD};text-decoration:none;">Instagram</a>
        <div style="margin-top:12px;color:${MUTED};">ROTA ATLAS TURİZM SEYAHAT ACENTASI · TÜRSAB No: 6739</div>
        <div style="margin-top:4px;color:${MUTED};">© Endülüs Travel</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

// ---- Exported HTML builders (also used by the dev preview script) ----
export const buildOpsHtml = ({ kind, name, email, phone, subject, message, meta } = {}) => {
  const k = kind || 'CONTACT';
  const row = (label, value) => value
    ? `<tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};width:120px;vertical-align:top;">${esc(label)}</td>
       <td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-family:Arial,sans-serif;font-size:14px;color:${TEXT};">${value}</td></tr>`
    : '';
  const metaHtml = meta && Object.keys(meta).length
    ? `<div style="margin-top:18px;"><div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};margin-bottom:8px;">Form Detayları</div>
       <pre style="margin:0;padding:14px;background:#0a0e1a;border:1px solid ${LINE};border-radius:12px;font-family:Consolas,Menlo,monospace;font-size:12px;color:${TEXT};white-space:pre-wrap;word-break:break-word;">${esc(JSON.stringify(meta, null, 2))}</pre></div>`
    : '';
  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Tür', `<strong style="color:${GOLD_BR};">${esc(k)}</strong>`)}
      ${row('Gönderen', esc(name || '—'))}
      ${row('E-posta', email ? `<a href="mailto:${esc(email)}" style="color:${GOLD};text-decoration:none;">${esc(email)}</a>` : '—')}
      ${row('Telefon', phone ? `<a href="tel:${esc(phone)}" style="color:${GOLD};text-decoration:none;">${esc(phone)}</a>` : '')}
      ${row('Konu', esc(subject))}
      ${row('Mesaj', message ? esc(message).replace(/\n/g, '<br>') : '')}
    </table>
    ${metaHtml}`;

  return shell({
    preheader: `Yeni ${k} mesajı: ${name || email || ''}`,
    heading: 'Yeni Form Bildirimi',
    intro: `Sitenizden yeni bir <strong style="color:${GOLD_BR};">${esc(k)}</strong> mesajı geldi.`,
    bodyHtml,
    cta: email ? { href: `mailto:${email}`, label: 'Yanıtla' } : null,
  });
};

// Notify the operations mailbox that a new lead/contact arrived.
export const sendOpsNotification = async (data = {}) => {
  if (!OPS_EMAIL) return false;
  const { kind, name, email, phone, subject, message, meta } = data;
  const k = kind || 'CONTACT';
  const summary = [
    `Tür: ${k}`,
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
    subject: `[Endülüs ${k}] ${subject || name || 'Yeni mesaj'}`,
    text: summary,
    html: buildOpsHtml(data),
  });
};

const ACK_LABELS = { CONTACT: 'mesajınızı', OFFER: 'teklif talebinizi', SURVEY: 'ön anketinizi' };

export const buildAckHtml = ({ kind, name } = {}) => {
  const what = ACK_LABELS[kind] || 'mesajınızı';
  return shell({
    preheader: `${name ? name + ', ' : ''}${what} aldık — en kısa sürede dönüş yapacağız.`,
    heading: `Teşekkürler${name ? ', ' + esc(name) : ''}`,
    intro: `<strong style="color:${GOLD_BR};">${esc(what)}</strong> aldık. Uzman ekibimiz mesai saatleri içinde (Pzt–Cum 09:00–18:00) en kısa sürede size geri dönecektir.`,
    bodyHtml: `
      <p style="margin:0 0 18px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:${TEXT};">
        Acil bir konunuz varsa WhatsApp üzerinden de bize hemen ulaşabilirsiniz.
      </p>
      <p style="margin:18px 0 0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:${MUTED};">
        Hassasiyetlerinize uygun, 15-20 kişilik butik turlar · Namaz vakitlerine uygun · Her şey dahil
      </p>`,
    cta: { href: WA_URL, label: "WhatsApp'tan Yazın" },
  });
};

// Thanks the visitor and sets a response-time expectation.
export const sendVisitorAck = async ({ kind, name, email } = {}) => {
  if (!email) return false;
  const what = ACK_LABELS[kind] || 'mesajınızı';
  const text = [
    `Merhaba ${name || ''},`,
    '',
    `${what} aldık. Ekibimiz mesai saatleri içinde (Pzt-Cum 09:00-18:00) en kısa sürede size geri dönecektir.`,
    '',
    'Acil bir konu için WhatsApp üzerinden de yazabilirsiniz: https://wa.me/905079384508',
    '',
    'Endülüs Travel',
    'ROTA ATLAS TURİZM SEYAHAT ACENTASI · TÜRSAB No: 6739',
  ].join('\n');

  return safeSend({
    from: MAIL_FROM,
    to: email,
    subject: 'Endülüs Travel — mesajınızı aldık',
    text,
    html: buildAckHtml({ kind, name }),
  });
};
