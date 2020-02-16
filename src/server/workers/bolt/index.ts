import { App, LogLevel } from '@slack/bolt';
import env from '@app/common/config/env';
import convoStore from './convoStore';
import logger from './logger';
import { save } from './utils';

const bolt = new App({
  logger,
  convoStore,
  logLevel: LogLevel.DEBUG,
  token: env.slack_bot_token,
  signingSecret: env.slack_signing_secret
});

// initiates a new conversation
bolt.message(/yo/i, async ({ context, message, say }) => {
  await save({ context, action: 'start', message });
  say(`Hey there <@${message.user}>!`);
  say(`What did you do yestesday?`);
});

// initiates a new conversation
bolt.message(/yeah/i, async ({ context, message, say }) => {
  await save({ context, action: 'end', message });
  say(`Ok we're done, have a great day`);
});

// asks for help
bolt.message(/help/i, async ({ message, say }) => {
  say(
    `How are you doing <@${message.user}>?
    Send \`Yo\` if you want to add a new daily entry`
  );
});

// what did you do yestesday?
bolt.message(/\w+/gi, async ({ context, message, say }) => {
  await save({ context, action: 'step_1', message });
  say(`oh nice`);
});

bolt.error(error => console.error(error));

export default bolt;
