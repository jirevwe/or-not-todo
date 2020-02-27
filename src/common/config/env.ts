import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variables required for all environments (dev, testing, staging, production)
 */
const requiredVariables = ['port', 'mongodb_url', 'worker_port'];

const env = {
  port: Number(process.env.PORT),
  redis_url: process.env.REDIS_URL,
  gateman_key: process.env.GATEMAN_KEY,
  mongodb_url: process.env.MONGODB_URL,
  redis_password: process.env.REDIS_PASSWORD,
  slack_bot_token: process.env.SLACK_BOT_TOKEN,
  worker_port: Number(process.env.WORKER_PORT),
  app_env: process.env.NODE_ENV || 'development',
  slack_members_url: process.env.SLACK_MEMBERS_URL,
  api_version: process.env.API_VERSION || '/api/v1',
  salt_rounds: Number(process.env.SALT_ROUNDS) || 10,
  worker_name: process.env.WORKER_NAME || 'usain-bolt',
  service_name: process.env.SERVICE_NAME || 'work-sheet',
  slack_signing_secret: process.env.SLACK_SIGNING_SECRET,
  slack_post_message_url: process.env.SLACK_POST_MESSAGE_URL,
  slack_standups_channel: process.env.SLACK_STANDUPS_CHANNEL
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
