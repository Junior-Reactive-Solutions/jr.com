const { z } = require('zod');

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5005),

  // Database
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_SERVER: z.string().min(1, 'DB_SERVER is required'),
  DB_DATABASE: z.string().min(1, 'DB_DATABASE is required'),

  // Frontend URLs
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),

  // JWT Secrets
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),

  // AI/Groq
  GROQ_API_KEY: z.string().optional(),

  // Email (optional but should be set in production)
  EMAIL_FROM: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),

  // Analytics (optional)
  ANALYTICS_ENABLED: z.enum(['true', 'false']).default('false'),
});

function validateEnv() {
  const env = process.env;

  try {
    const validated = envSchema.parse(env);
    return validated;
  } catch (error) {
    console.error('Environment validation failed:');
    if (error.errors) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

module.exports = { envSchema, validateEnv };
