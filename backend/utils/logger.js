const pino = require('pino');

const secretKeys = [
  'password',
  'passwordHash',
  'token',
  'refreshToken',
  'secret',
  'key',
  'apiKey',
  'api_key',
  'subscriptionKey',
  'clientSecret',
  'client_secret',
  'authorization',
  'jwtSecret',
  'dbPassword',
  'groqApiKey',
];

// Redact secrets at the top level and one level of nesting (fast-redact does
// not support a `**` deep wildcard, so we expand to bare + single-wildcard).
const redactPaths = secretKeys.flatMap(key => [key, `*.${key}`]);

const pinoConfig = {
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: redactPaths,
    censor: '[REDACTED]',
  },
};

if (process.env.NODE_ENV === 'development') {
  pinoConfig.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

const logger = pino(pinoConfig);

module.exports = logger;
