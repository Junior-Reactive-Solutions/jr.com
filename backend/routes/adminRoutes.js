const express  = require('express');
const rateLimit = require('express-rate-limit');
const router   = express.Router();
const ctrl     = require('../controllers/adminController');
const { adminAuth } = require('../middleware/adminAuth');

// ── Login rate limit: 5 attempts per 15 min ────────────────────────────────────
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, error: 'Too many login attempts. Try again in 15 minutes.' },
});

// ── Public routes ─────────────────────────────────────────────────────────────
router.post('/login',  loginLimiter, ctrl.login);
router.post('/logout', ctrl.logout);

// ── Protected routes (all require valid JWT cookie) ───────────────────────────
router.get('/verify', adminAuth, ctrl.verify);

// Dashboard
router.get('/dashboard', adminAuth, ctrl.getDashboard);

// Messages
router.get('/messages',           adminAuth, ctrl.getMessages);
router.get('/messages/:id',       adminAuth, ctrl.getMessage);
router.post('/messages/:id/reply',adminAuth, ctrl.replyToMessage);
router.patch('/messages/:id/read',adminAuth, ctrl.markRead);
router.delete('/messages/:id',    adminAuth, ctrl.deleteMessage);

// Applications
router.get('/applications',              adminAuth, ctrl.getApplications);
router.get('/applications/:id',          adminAuth, ctrl.getApplication);
router.patch('/applications/:id/status', adminAuth, ctrl.updateStatus);
router.delete('/applications/:id',       adminAuth, ctrl.deleteApplication);

// Services CRUD
router.post('/services',       adminAuth, ctrl.createService);
router.put('/services/:id',    adminAuth, ctrl.updateService);
router.delete('/services/:id', adminAuth, ctrl.deleteService);

// FAQs CRUD
router.get('/faqs',           adminAuth, ctrl.getFAQsAdmin);
router.post('/faqs',          adminAuth, ctrl.createFAQ);
router.put('/faqs/:id',       adminAuth, ctrl.updateFAQ);
router.delete('/faqs/:id',    adminAuth, ctrl.deleteFAQ);
router.patch('/faqs/reorder', adminAuth, ctrl.reorderFAQs);

// Analytics
router.get('/analytics', adminAuth, ctrl.getAnalytics);

module.exports = router;
