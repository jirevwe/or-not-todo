import { App, LogLevel } from '@slack/bolt';
import env from '@app/common/config/env';
import logger from './logger';
import { processMessage } from './utils';

const bolt = new App({
  logger,
  logLevel: LogLevel.DEBUG,
  token: env.slack_bot_token,
  signingSecret: env.slack_signing_secret
});

bolt.message(/\w+/gi, async ({ message, say }) => {
  try {
    // omly process the message if it's sent in a DM.
    if (message.channel === 'im') await processMessage(message, say);
  } catch (error) {
    logger.error(error);
  }
});

bolt.error(error => logger.error(error));

export default bolt;
