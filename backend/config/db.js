const { Pool } = require('pg');
const dotenv = require('dotenv');
const logger = require('../utils/logger');
dotenv.config();

let pool;

// SSL based on the actual host being connected to, not NODE_ENV — a
// cloud-hosted Postgres (Neon, Render, etc.) requires SSL even when
// connecting from local dev. Only skip it for a genuinely local server.
function needsSSL(connectionString) {
    if (!connectionString) return false;
    try {
        const { hostname } = new URL(connectionString);
        return hostname !== 'localhost' && hostname !== '127.0.0.1';
    } catch {
        return false;
    }
}

async function connectDB() {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: needsSSL(process.env.DATABASE_URL)
                ? { rejectUnauthorized: false }
                : false,
        });

        // Test the connection
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();

        logger.info('PostgreSQL connected successfully');
    } catch (err) {
        logger.error({ err }, 'Database connection failed');
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        } else {
            logger.warn('Development mode: continuing without database');
        }
    }
}

function getPool() {
    if (!pool) throw new Error('Database not initialised. Call connectDB() first.');
    return pool;
}

module.exports = { connectDB, getPool };
