const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const dotenv     = require('dotenv');
const rateLimit  = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi  = require('swagger-ui-express');

dotenv.config();

const { connectDB, getPool }   = require('./config/db');
const contentRoutes            = require('./routes/contentRoutes');
const submissionRoutes         = require('./routes/submissionRoutes');
const aiRoutes                 = require('./routes/aiRoutes');
const adminRoutes              = require('./routes/adminRoutes');
const analyticsRoutes          = require('./routes/analyticsRoutes');
const errorHandler             = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5005;

// ─── TRUST PROXY (Render / reverse proxy) ────────────────────────────────────
app.set('trust proxy', 1);

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Extra origins (e.g. new preview URLs) can be added via ALLOWED_ORIGINS
// as a comma-separated list without a code change.
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const allowed = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3333',
            'http://localhost:5005',
            'http://localhost:5006',
            'https://jrcom.vercel.app',
            'https://juniorreactive.com',
            'https://www.juniorreactive.com',
            process.env.FRONTEND_URL,
            ...extraOrigins,
        ].filter(Boolean);
        if (allowed.includes(origin)) return callback(null, true);
        // Allow only THIS project's Vercel preview deployments (jrcom-*.vercel.app),
        // not every *.vercel.app site.
        if (/^https:\/\/jrcom[\w-]*\.vercel\.app$/.test(origin)) return callback(null, true);
        callback(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,   // Required for cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── HELMET ───────────────────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc:  ["'self'"],
            scriptSrc:   ["'self'", "'unsafe-inline'", 'unpkg.com', 'cdn.jsdelivr.net'],
            styleSrc:    ["'self'", "'unsafe-inline'", 'unpkg.com', 'cdn.jsdelivr.net'],
            imgSrc:      ["'self'", 'data:', 'validator.swagger.io'],
            workerSrc:   ["'self'", 'blob:'],
            connectSrc:  ["'self'", 'https://api.groq.com', 'https://api.resend.com'],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── RATE LIMITING ────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 300,
    standardHeaders: true, legacyHeaders: false,
    message: { success: false, error: 'Too many requests. Please try again later.' },
});
const submissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, max: 20,
    standardHeaders: true, legacyHeaders: false,
    message: { success: false, error: 'Too many submissions. Please try again in an hour.' },
});

app.use('/api/', generalLimiter);
app.use('/api/contact', submissionLimiter);
app.use('/api/apply',   submissionLimiter);

// ─── SWAGGER ──────────────────────────────────────────────────────────────────
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Junior Reactive API',
            version: '2.1.0',
            description: 'Full API including admin, analytics, and AI endpoints.',
            contact: { name: 'Junior Reactive', email: 'juniorreactive@gmail.com' },
        },
        servers: [
            { url: 'http://localhost:5005',                      description: 'Development' },
            { url: 'https://jr-backend-1edu.onrender.com',       description: 'Production' },
        ],
        tags: [
            { name: 'Health' },
            { name: 'Services' },
            { name: 'Blog' },
            { name: 'Portfolio' },
            { name: 'Team' },
            { name: 'FAQs' },
            { name: 'Contact' },
            { name: 'Applications' },
            { name: 'AI',        description: 'AI chatbot & brief generator' },
            { name: 'Admin',     description: 'Admin panel endpoints (auth required)' },
            { name: 'Analytics', description: 'Page view tracking' },
        ],
        components: {
            securitySchemes: {
                cookieAuth: { type: 'apiKey', in: 'cookie', name: 'adminToken' },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar{display:none}.swagger-ui .info .title{color:#1c265e}',
    customSiteTitle: 'Junior Reactive API Docs',
    swaggerOptions: { persistAuthorization: true, displayRequestDuration: true, docExpansion: 'list', filter: true },
}));

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Junior Reactive API is running',
        timestamp: new Date().toISOString(),
    });
});

// ─── DETAILED HEALTH CHECK (with database) ──────────────────────────────────────
app.get('/api/health/detailed', async (req, res) => {
    try {
        const pool = getPool();
        await pool.query('SELECT 1 AS ping');
        res.json({
            status: 'OK',
            message: 'Junior Reactive API is fully operational',
            database: 'Connected',
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({
            status: 'Degraded',
            message: 'API is running but database unavailable',
            database: 'Disconnected',
            error: err.message,
            timestamp: new Date().toISOString(),
        });
    }
});

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api',            contentRoutes);
app.use('/api',            submissionRoutes);
app.use('/api/ai',         aiRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/analytics',  analyticsRoutes);

// 404 catch
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: `Endpoint not found: ${req.method} ${req.path}` });
});

app.use(errorHandler);

// ─── GRACEFUL SHUTDOWN ────────────────────────────────────────────────────────
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    try { const pool = getPool(); await pool.end(); } catch (_) {}
    process.exit(0);
});

// ─── START ────────────────────────────────────────────────────────────────────
(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log('='.repeat(60));
        console.log('  JUNIOR REACTIVE API SERVER');
        console.log('='.repeat(60));
        console.log(`  API:      http://localhost:${PORT}/api`);
        console.log(`  Swagger:  http://localhost:${PORT}/api-docs`);
        console.log(`  Health:   http://localhost:${PORT}/api/health`);
        console.log(`  Admin:    http://localhost:${PORT}/api/admin`);
        console.log(`  AI Chat:  http://localhost:${PORT}/api/ai/chat`);
        console.log('='.repeat(60));
    });
})();
