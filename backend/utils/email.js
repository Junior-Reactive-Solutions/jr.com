const nodemailer = require('nodemailer');
const https = require('https');
const logger = require('./logger');

// Brand colors for email templates
const BRAND = {
    primary: '#1c265e', secondary: '#5269c3',
    accent: '#a8ccee', light: '#e4eaf9',
};
const RECIPIENT    = process.env.NOTIFY_EMAIL    || 'juniorreactive@gmail.com';
const WA_RECIPIENT = process.env.NOTIFY_WHATSAPP || ''; // e.g. 256764524816

// Email transporter
function createTransporter() {
    const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env;
    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
        logger.info('Email not configured — add EMAIL_* vars to backend/.env');
        return null;
    }
    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        tls: { rejectUnauthorized: false },
    });
}

// WhatsApp Cloud API
// Sends a message to your WhatsApp number via Meta's free Cloud API.
// Required env vars:
//   WA_PHONE_NUMBER_ID  — Sender phone number ID (from Meta Developer Console)
//   WA_ACCESS_TOKEN     — Permanent System User access token
//   NOTIFY_WHATSAPP     — Your number with country code, no + (e.g. 256764524816)
async function sendWhatsApp(text) {
    const { WA_PHONE_NUMBER_ID, WA_ACCESS_TOKEN } = process.env;
    if (!WA_PHONE_NUMBER_ID || !WA_ACCESS_TOKEN || !WA_RECIPIENT) {
        console.info('WhatsApp not configured — add WA_* vars to backend/.env');
        return;
    }

    const payload = JSON.stringify({
        messaging_product: 'whatsapp',
        to: WA_RECIPIENT,
        type: 'text',
        text: { preview_url: false, body: text },
    });

    return new Promise((resolve) => {
        const req = https.request(
            {
                hostname: 'graph.facebook.com',
                path: `/v19.0/${WA_PHONE_NUMBER_ID}/messages`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${WA_ACCESS_TOKEN}`,
                    'Content-Length': Buffer.byteLength(payload),
                },
            },
            (res) => {
                let body = '';
                res.on('data', chunk => { body += chunk; });
                res.on('end', () => {
                    if (res.statusCode === 200 || res.statusCode === 201) {
                        logger.info('WhatsApp alert sent');
                    } else {
                        logger.warn({ statusCode: res.statusCode }, 'WhatsApp API request failed');
                    }
                    resolve();
                });
            }
        );
        req.on('error', (err) => {
            console.warn(`WARN: WhatsApp send failed: ${err.message}`);
            resolve(); // never crash the form submission
        });
        req.write(payload);
        req.end();
    });
}

// Email HTML helpers
function baseTemplate(title, accentColor, badgeText, bodyHtml) {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f0f2f8;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f8;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(28,38,94,.15);">
      <tr>
        <td style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.secondary} 100%);padding:36px 40px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6);">Junior Reactive</p>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;line-height:1.2;">${title}</h1>
            </td>
            <td align="right" style="vertical-align:top;">
              <span style="display:inline-block;background:${accentColor};color:#fff;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:6px 14px;border-radius:999px;">${badgeText}</span>
            </td>
          </tr></table>
        </td>
      </tr>
      <tr><td style="background:#fff;padding:36px 40px;">${bodyHtml}</td></tr>
      <tr>
        <td style="background:${BRAND.light};padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:${BRAND.secondary};font-weight:600;">Junior Reactive — AI &amp; IT Solutions</p>
          <p style="margin:4px 0 0;font-size:11px;color:#888;">Kampala, Uganda · juniorreactive@gmail.com</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function field(label, value, link) {
    const val = link
        ? `<a href="${link}" style="color:${BRAND.secondary};font-weight:600;text-decoration:none;">${value}</a>`
        : `<span style="color:#1a2240;font-weight:600;">${value || '—'}</span>`;
    return `<tr><td style="padding:10px 0;border-bottom:1px solid ${BRAND.light};">
      <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#999;">${label}</span><br/>${val}
    </td></tr>`;
}

function messageBox(label, text) {
    return `<p style="margin:24px 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#999;">${label}</p>
    <div style="background:${BRAND.light};border-left:4px solid ${BRAND.secondary};border-radius:0 8px 8px 0;padding:16px 20px;">
      <p style="margin:0;font-size:15px;line-height:1.7;color:#1a2240;white-space:pre-wrap;">${text}</p>
    </div>`;
}

function replyButton(email, subject, firstName) {
    return `<div style="margin-top:28px;text-align:center;">
      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
         style="display:inline-block;background:linear-gradient(135deg,${BRAND.primary},${BRAND.secondary});color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none;">
        Reply to ${firstName}
      </a>
    </div>`;
}

// Contact notification
async function sendContactNotification(data) {
    // Email
    const transporter = createTransporter();
    if (transporter) {
        const body = `
        <table width="100%" cellpadding="0" cellspacing="0">
          ${field('Name', data.name)}
          ${field('Email', data.email, `mailto:${data.email}`)}
          ${field('Subject', data.subject)}
        </table>
        ${messageBox('Message', data.message)}
        ${replyButton(data.email, data.subject, data.name.split(' ')[0])}`;
        try {
            await transporter.sendMail({
                from: `"Junior Reactive Website" <${process.env.EMAIL_USER}>`,
                to: RECIPIENT, replyTo: data.email,
                subject: `New Contact: ${data.subject}`,
                html: baseTemplate('New Contact Message', 'rgba(255,255,255,.25)', 'Contact Form', body),
            });
            logger.info('Contact email sent');
        } catch (err) {
            logger.warn({ err }, 'Contact email failed');
        }
    }

    // WhatsApp
    await sendWhatsApp(
`*New Contact — JR Website*

*Name:* ${data.name}
*Email:* ${data.email}
*Subject:* ${data.subject}

*Message:*
${data.message.length > 280 ? data.message.slice(0, 280) + '…' : data.message}`
    );
}

// Application notification
async function sendApplicationNotification(data) {
    // Email
    const transporter = createTransporter();
    if (transporter) {
        const body = `
        <table width="100%" cellpadding="0" cellspacing="0">
          ${data.company ? field('Company', data.company) : ''}
          ${field('Contact Person', data.name)}
          ${field('Email', data.email, `mailto:${data.email}`)}
          ${data.phone ? field('Phone', data.phone, `tel:${data.phone}`) : ''}
          ${field('Service Applied For', data.service_type)}
        </table>
        ${messageBox('Project Requirements', data.requirements)}
        ${replyButton(data.email, `Your Application for ${data.service_type}`, data.name.split(' ')[0])}`;
        try {
            await transporter.sendMail({
                from: `"Junior Reactive Website" <${process.env.EMAIL_USER}>`,
                to: RECIPIENT, replyTo: data.email,
                subject: `New Application: ${data.service_type} — ${data.company || data.name}`,
                html: baseTemplate('New Service Application', 'rgba(255,255,255,.2)', 'Application', body),
            });
            logger.info('Application email sent');
        } catch (err) {
            logger.warn({ err }, 'Application email failed');
        }
    }

    // WhatsApp
    await sendWhatsApp(
`*New Application — JR Website*

${data.company ? `*Company:* ${data.company}\n` : ''}*Name:* ${data.name}
*Email:* ${data.email}
${data.phone ? `*Phone:* ${data.phone}\n` : ''}*Service:* ${data.service_type}

*Requirements:*
${data.requirements.length > 280 ? data.requirements.slice(0, 280) + '…' : data.requirements}`
    );
}

module.exports = { sendContactNotification, sendApplicationNotification };
