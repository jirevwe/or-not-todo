import { App } from '@slack/bolt';
import env from '@app/common/config/env';

const bolt = new App({
  token: env.slack_bot_token,
  signingSecret: env.slack_signing_secret
});

// Listens to incoming messages that contain "hello"
bolt.message('hello', ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  say(`Hey there <@${message.user}>!`);
});

// Listens to incoming messages that contain "hello"
bolt.message('yo', ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey there <@${message.user}>!`
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Click Me'
          },
          action_id: 'button_click'
        }
      }
    ]
  });
});

bolt.action('button_click', ({ body, ack, say }) => {
  // Acknowledge the action
  ack();
  say(`<@${body.user.id}> clicked the button`);
});

export default bolt;
