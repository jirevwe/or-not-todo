import { App, LogLevel } from '@slack/bolt';
import env from '@app/common/config/env';
import logger from './logger';
import { processMessage } from './conversation';
import redis from '@app/common/services/redis';

const bolt = new App({
  logger,
  logLevel: LogLevel.DEBUG,
  token: env.slack_bot_token,
  signingSecret: env.slack_signing_secret
});

bolt.message(/\w+/gi, async ({ message, say }) => {
  try {
    const messageKey = `${message.channel_type}:${message.user}:${message.client_msg_id}`.toLowerCase();
    const value = await redis.get(messageKey);

    // omly process the message if it's sent in a DM.
    if (message.channel_type === 'im' && value === null) {
      await processMessage(message, say);
      await redis.set(messageKey, messageKey, 'EX', 86400);
    }
  } catch (error) {
    logger.error(error);
  }
});

bolt.error(error => logger.error(error));

export default bolt;
