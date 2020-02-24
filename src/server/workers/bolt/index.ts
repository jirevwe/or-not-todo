import { App, LogLevel } from '@slack/bolt';
import env from '@app/common/config/env';
import logger from './logger';
import { triggerStandup } from './conversation';

const bolt = new App({
  logger,
  logLevel: LogLevel.DEBUG,
  token: env.slack_bot_token,
  signingSecret: env.slack_signing_secret
});

bolt.message(/\w+/gi, async ({ message, say }) => {
  try {
    await triggerStandup(message, say);
  } catch (error) {
    logger.error(error);
  }
});

bolt.error(error => logger.error(error));

export default bolt;
