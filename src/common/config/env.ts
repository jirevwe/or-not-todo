import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variables required for all environments (dev, testing, staging, production)
 */
const requiredVariables = [
  'port',
  'redis_url',
  'salt_rounds',
  'gateman_key',
  'mongodb_url'
];

/**
 * Environment variables required for both staging and production
 */
const productionAndStagingVariables = [
  'redis_password',
  'pep_alert_email',
  'mongodb_username',
  'mongodb_password',
  'watchlist_endpoint'
];

/**
 * Requires MongoDB and Redis credentials in production and staging, else uses Redis and MongoDB connection string directly
 * in dev or any other environment
 */
if (['production', 'staging'].includes(process.env.NODE_ENV))
  requiredVariables.push(...productionAndStagingVariables);

const env = {
  port: Number(process.env.PORT),
  redis_url: process.env.REDIS_URL,
  jwt_secret: process.env.JWT_SECRET,
  gateman_key: process.env.GATEMAN_KEY,
  mongodb_url: process.env.MONGODB_URL,
  redis_password: process.env.REDIS_PASSWORD,
  slack_bot_token: process.env.SLACK_BOT_TOKEN,
  worker_port: Number(process.env.WORKER_PORT),
  app_env: process.env.NODE_ENV || 'development',
  api_version: process.env.API_VERSION || '/api/v1',
  salt_rounds: Number(process.env.SALT_ROUNDS) || 10,
  service_name: process.env.SERVICE_NAME || 'work-sheet',
  slack_signing_secret: process.env.SLACK_SIGNING_SECRET
};

const missingVariables = requiredVariables.reduce((acc, variable) => {
  const isVariableMissing = !env[variable];
  return isVariableMissing ? acc.concat(variable.toUpperCase()) : acc;
}, []);

if (!!missingVariables.length)
  throw new Error(
    `The following required variables are missing: ${missingVariables}}`
  );

export default env;
