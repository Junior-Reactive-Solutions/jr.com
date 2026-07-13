const { Pool } = require('pg');
const dotenv = require('dotenv');
const logger = require('../utils/logger');
dotenv.config();

let pool;

async function connectDB() {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production'
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
