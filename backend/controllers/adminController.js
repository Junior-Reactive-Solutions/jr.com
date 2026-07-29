const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');
const { Resend } = require('resend');
const admin     = require('../models/adminModel');
const faqModel  = require('../models/faqModel');
const blogModel = require('../models/blogModel');
const logger    = require('../utils/logger');
const { JWT_SECRET } = require('../middleware/adminAuth');

// Session length for the admin JWT. A solo-admin panel doesn't need
// enterprise-grade 15-minute expiry with refresh tokens (that needs a
// server-side revocation store we don't have yet — see DECISIONS.md) but
// 24h was too long. 8h covers a working day and forces a fresh login daily.
const SESSION_MS = 8 * 60 * 60 * 1000;

if (!process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD) {
    logger.warn(
        'ADMIN_PASSWORD_HASH is not set — falling back to plaintext ADMIN_PASSWORD comparison. ' +
        'Generate a hash with: node -e "console.log(require(\'bcryptjs\').hashSync(\'yourpassword\', 12))" ' +
        'and set it as ADMIN_PASSWORD_HASH, then remove ADMIN_PASSWORD.'
    );
}

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Helpers ───────────────────────────────────────────────────────────────────
function timingSafeCompare(a, b) {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    if (bufA.length !== bufB.length) {
        // Still do the comparison to prevent timing attacks
        crypto.timingSafeEqual(bufA, bufA);
        return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
}

// Escape HTML so visitor-submitted content can't inject markup into the email.
function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildEmailHtml({ toName, toEmail, replyBody, originalSubject, originalMessage, originalDate }) {
    // Escape first, then turn newlines into <br/> for display.
    const safeName    = escapeHtml(toName);
    const safeEmail   = escapeHtml(toEmail);
    const safeSubject = escapeHtml(originalSubject);
    const safeDate    = escapeHtml(originalDate);
    const safeReply   = escapeHtml(replyBody).replace(/\n/g, '<br/>');
    const safeOriginal = originalMessage ? escapeHtml(originalMessage).replace(/\n/g, '<br/>') : '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Junior Reactive</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(28,38,94,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1c265e 0%,#2d3a7a 100%);padding:32px 40px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:8px 20px;margin-bottom:12px;">
              <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                <span style="color:#ffffff;">J</span><span style="color:rgba(255,255,255,0.55);">R</span>
              </span>
            </div>
            <div style="color:rgba(255,255,255,0.9);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">Junior Reactive · AI & IT Solutions</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 8px;font-size:15px;color:#6b7280;">Hello <strong style="color:#1a1a2e;">${safeName}</strong>,</p>
            <div style="font-size:15px;color:#374151;line-height:1.7;white-space:pre-line;margin:24px 0;">${safeReply}</div>

            <!-- Signature -->
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e8eaf0;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#1c265e;">Pharrell Aaron Mugumya</p>
              <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Founder & CEO · Junior Reactive</p>
              <p style="margin:8px 0 0;font-size:13px;color:#5269c3;">
                juniorreactive@gmail.com &nbsp;|&nbsp; +256 764 524 816
              </p>
            </div>
          </td>
        </tr>

        <!-- Original Message -->
        ${originalMessage ? `
        <tr>
          <td style="padding:0 40px 32px;">
            <div style="background:#f8f9ff;border-left:3px solid #5269c3;border-radius:0 8px 8px 0;padding:16px 20px;">
              <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;color:#9ca3af;">Original message · ${safeDate}</p>
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280;"><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
              <p style="margin:0 0 12px;font-size:13px;color:#6b7280;"><strong>Subject:</strong> ${safeSubject}</p>
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;white-space:pre-line;">${safeOriginal}</p>
            </div>
          </td>
        </tr>` : ''}

        <!-- Footer -->
        <tr>
          <td style="background:#1c265e;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5);">© ${new Date().getFullYear()} Junior Reactive · Kampala, Uganda · <a href="https://jrcom.vercel.app" style="color:rgba(255,255,255,0.6);text-decoration:none;">jrcom.vercel.app</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
async function login(req, res) {
    const { password } = req.body;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    const ADMIN_PASSWORD      = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD) {
        return res.status(500).json({ success: false, error: 'Admin not configured on server.' });
    }
    if (!password) {
        return res.status(401).json({ success: false, error: 'Incorrect password.' });
    }

    // Prefer the bcrypt hash; fall back to legacy plaintext comparison only
    // if no hash has been configured yet (safe migration path — see the
    // startup warning above for how to generate ADMIN_PASSWORD_HASH).
    const valid = ADMIN_PASSWORD_HASH
        ? await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
        : timingSafeCompare(password, ADMIN_PASSWORD);

    if (!valid) {
        return res.status(401).json({ success: false, error: 'Incorrect password.' });
    }

    const token = jwt.sign({ role: 'admin', name: 'Pharrell' }, JWT_SECRET, { expiresIn: '8h' });

    res.cookie('adminToken', token, {
        httpOnly:  true,
        secure:    process.env.NODE_ENV === 'production',
        sameSite:  process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge:    SESSION_MS,
        path:      '/',
    });

    await admin.logAdminAction('login', 'Admin logged in');
    res.json({ success: true, message: 'Logged in successfully.' });
}

async function logout(req, res) {
    res.clearCookie('adminToken', { path: '/' });
    res.json({ success: true, message: 'Logged out.' });
}

async function verify(req, res) {
    // If this is reached, adminAuth middleware already passed
    res.json({ success: true, admin: req.admin });
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
async function getDashboard(req, res, next) {
    try {
        const [stats, chart, topPages] = await Promise.all([
            admin.getDashboardStats(),
            admin.getPageViewsChart(),
            admin.getTopPages(),
        ]);
        const [recentMessages, recentApps] = await Promise.all([
            admin.getAllMessages({ limit: 5 }),
            admin.getAllApplications({ limit: 5 }),
        ]);
        res.json({ success: true, data: { stats, chart, topPages, recentMessages, recentApps } });
    } catch (err) { next(err); }
}

// ── Messages ──────────────────────────────────────────────────────────────────
async function getMessages(req, res, next) {
    try {
        const limit  = parseInt(req.query.limit)  || 50;
        const offset = parseInt(req.query.offset) || 0;
        const rows = await admin.getAllMessages({ limit, offset });
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
}

async function getMessage(req, res, next) {
    try {
        const msg = await admin.getMessageById(req.params.id);
        if (!msg) return res.status(404).json({ success: false, error: 'Message not found.' });
        // Mark read on view
        if (!msg.is_read) await admin.markMessageRead(req.params.id);
        res.json({ success: true, data: msg });
    } catch (err) { next(err); }
}

async function replyToMessage(req, res, next) {
    try {
        const { id } = req.params;
        const { replyBody } = req.body;

        if (!replyBody?.trim()) {
            return res.status(400).json({ success: false, error: 'Reply body is required.' });
        }

        const msg = await admin.getMessageById(id);
        if (!msg) return res.status(404).json({ success: false, error: 'Message not found.' });

        const html = buildEmailHtml({
            toName:          msg.name,
            toEmail:         msg.email,
            replyBody:       replyBody.trim(),
            originalSubject: msg.subject,
            originalMessage: msg.message,
            originalDate:    new Date(msg.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        });

        const { error } = await resend.emails.send({
            from:    'Junior Reactive <onboarding@resend.dev>',
            to:      msg.email,
            subject: `Re: ${msg.subject}`,
            html,
        });

        if (error) {
            const detail = JSON.stringify(error);
            logger.error({ resendError: error }, 'Resend email send failed');
            return res.status(500).json({
                success: false,
                error: `Email send failed: ${error.message || detail}. Check RESEND_API_KEY on Render.`
            });
        }

        await admin.markMessageReplied(id);
        await admin.logAdminAction('reply_message', `Replied to message #${id} — ${msg.email}`);
        res.json({ success: true, message: `Reply sent to ${msg.email}` });
    } catch (err) { next(err); }
}

async function markRead(req, res, next) {
    try {
        await admin.markMessageRead(req.params.id);
        res.json({ success: true });
    } catch (err) { next(err); }
}

async function deleteMessage(req, res, next) {
    try {
        await admin.deleteMessage(req.params.id);
        await admin.logAdminAction('delete_message', `Deleted message #${req.params.id}`);
        res.json({ success: true, message: 'Message deleted.' });
    } catch (err) { next(err); }
}

// ── Applications ──────────────────────────────────────────────────────────────
async function getApplications(req, res, next) {
    try {
        const limit  = parseInt(req.query.limit)  || 50;
        const offset = parseInt(req.query.offset) || 0;
        const rows = await admin.getAllApplications({ limit, offset });
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
}

async function getApplication(req, res, next) {
    try {
        const app = await admin.getApplicationById(req.params.id);
        if (!app) return res.status(404).json({ success: false, error: 'Application not found.' });
        res.json({ success: true, data: app });
    } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
    try {
        const { status } = req.body;
        const valid = ['new', 'reviewed', 'accepted', 'rejected'];
        if (!valid.includes(status)) {
            return res.status(400).json({ success: false, error: `Status must be one of: ${valid.join(', ')}` });
        }
        await admin.updateApplicationStatus(req.params.id, status);
        await admin.logAdminAction('update_application_status', `Application #${req.params.id} -> ${status}`);
        res.json({ success: true, message: `Status updated to ${status}` });
    } catch (err) { next(err); }
}

async function deleteApplication(req, res, next) {
    try {
        await admin.deleteApplication(req.params.id);
        await admin.logAdminAction('delete_application', `Deleted application #${req.params.id}`);
        res.json({ success: true, message: 'Application deleted.' });
    } catch (err) { next(err); }
}

// ── Services ──────────────────────────────────────────────────────────────────
async function createService(req, res, next) {
    try {
        const { key, title, icon, shortDescription, fullDescription } = req.body;
        if (!key || !title || !shortDescription) {
            return res.status(400).json({ success: false, error: 'key, title, and shortDescription are required.' });
        }
        const result = await admin.createService({ key, title, icon: icon || 'settings', shortDescription, fullDescription: fullDescription || shortDescription });
        await admin.logAdminAction('create_service', `Created service: ${title}`);
        res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
}

async function updateService(req, res, next) {
    try {
        const { title, icon, shortDescription, fullDescription } = req.body;
        await admin.updateService(req.params.id, { title, icon, shortDescription, fullDescription });
        await admin.logAdminAction('update_service', `Updated service #${req.params.id}: ${title}`);
        res.json({ success: true, message: 'Service updated.' });
    } catch (err) { next(err); }
}

async function deleteService(req, res, next) {
    try {
        await admin.deleteService(req.params.id);
        await admin.logAdminAction('delete_service', `Deleted service #${req.params.id}`);
        res.json({ success: true, message: 'Service deleted.' });
    } catch (err) { next(err); }
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
async function getFAQsAdmin(req, res, next) {
    try {
        const rows = await faqModel.getAllFAQs();
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
}

async function createFAQ(req, res, next) {
    try {
        const { question, answer } = req.body;
        if (!question?.trim() || !answer?.trim()) {
            return res.status(400).json({ success: false, error: 'question and answer are required.' });
        }
        const result = await faqModel.createFAQ({ question: question.trim(), answer: answer.trim() });
        await admin.logAdminAction('create_faq', `Created FAQ: ${question.slice(0, 60)}`);
        res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
}

async function updateFAQ(req, res, next) {
    try {
        const { question, answer } = req.body;
        if (!question?.trim() || !answer?.trim()) {
            return res.status(400).json({ success: false, error: 'question and answer are required.' });
        }
        await faqModel.updateFAQ(req.params.id, { question: question.trim(), answer: answer.trim() });
        await admin.logAdminAction('update_faq', `Updated FAQ #${req.params.id}`);
        res.json({ success: true, message: 'FAQ updated.' });
    } catch (err) { next(err); }
}

async function deleteFAQ(req, res, next) {
    try {
        await faqModel.deleteFAQ(req.params.id);
        await admin.logAdminAction('delete_faq', `Deleted FAQ #${req.params.id}`);
        res.json({ success: true, message: 'FAQ deleted.' });
    } catch (err) { next(err); }
}

async function reorderFAQs(req, res, next) {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
            return res.status(400).json({ success: false, error: 'orderedIds must be a non-empty array.' });
        }
        await faqModel.reorderFAQs(orderedIds);
        res.json({ success: true, message: 'Order updated.' });
    } catch (err) { next(err); }
}

// ── Blog ──────────────────────────────────────────────────────────────────────
function slugify(str) {
    return String(str)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 200);
}

async function getBlogPostsAdmin(req, res, next) {
    try {
        const rows = await blogModel.getAllBlogPostsAdmin();
        res.json({ success: true, data: rows });
    } catch (err) { next(err); }
}

async function getBlogPostAdmin(req, res, next) {
    try {
        const post = await blogModel.getBlogPostByIdAdmin(req.params.id);
        if (!post) return res.status(404).json({ success: false, error: 'Post not found.' });
        res.json({ success: true, data: post });
    } catch (err) { next(err); }
}

async function createBlogPost(req, res, next) {
    try {
        const { title, excerpt, content, author, publishDate } = req.body;
        let { slug } = req.body;
        if (!title?.trim() || !excerpt?.trim() || !content?.trim() || !author?.trim()) {
            return res.status(400).json({ success: false, error: 'title, excerpt, content, and author are required.' });
        }
        slug = slugify(slug?.trim() || title);
        if (!slug) {
            return res.status(400).json({ success: false, error: 'Could not generate a valid slug from the title.' });
        }
        if (await blogModel.slugExists(slug)) {
            return res.status(409).json({ success: false, error: `A post with slug "${slug}" already exists.` });
        }
        const result = await blogModel.createBlogPost({
            title: title.trim(), slug, excerpt: excerpt.trim(), content: content.trim(),
            author: author.trim(), publishDate: publishDate || undefined,
        });
        await admin.logAdminAction('create_blog_post', `Created blog post: ${title.slice(0, 60)}`);
        res.status(201).json({ success: true, data: { id: result.id, slug } });
    } catch (err) { next(err); }
}

async function updateBlogPost(req, res, next) {
    try {
        const { title, excerpt, content, author, publishDate } = req.body;
        let { slug } = req.body;
        if (!title?.trim() || !excerpt?.trim() || !content?.trim() || !author?.trim()) {
            return res.status(400).json({ success: false, error: 'title, excerpt, content, and author are required.' });
        }
        slug = slugify(slug?.trim() || title);
        if (!slug) {
            return res.status(400).json({ success: false, error: 'Could not generate a valid slug from the title.' });
        }
        if (await blogModel.slugExists(slug, req.params.id)) {
            return res.status(409).json({ success: false, error: `A post with slug "${slug}" already exists.` });
        }
        await blogModel.updateBlogPost(req.params.id, {
            title: title.trim(), slug, excerpt: excerpt.trim(), content: content.trim(),
            author: author.trim(), publishDate,
        });
        await admin.logAdminAction('update_blog_post', `Updated blog post #${req.params.id}`);
        res.json({ success: true, message: 'Post updated.', data: { slug } });
    } catch (err) { next(err); }
}

async function deleteBlogPost(req, res, next) {
    try {
        await blogModel.deleteBlogPost(req.params.id);
        await admin.logAdminAction('delete_blog_post', `Deleted blog post #${req.params.id}`);
        res.json({ success: true, message: 'Post deleted.' });
    } catch (err) { next(err); }
}

// ── Analytics ─────────────────────────────────────────────────────────────────
async function getAnalytics(req, res, next) {
    try {
        const data = await admin.getAnalyticsSummary();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

module.exports = {
    login, logout, verify,
    getDashboard,
    getMessages, getMessage, replyToMessage, markRead, deleteMessage,
    getApplications, getApplication, updateStatus, deleteApplication,
    createService, updateService, deleteService,
    getFAQsAdmin, createFAQ, updateFAQ, deleteFAQ, reorderFAQs,
    getBlogPostsAdmin, getBlogPostAdmin, createBlogPost, updateBlogPost, deleteBlogPost,
    getAnalytics,
};
