import { ConversationMessage } from '@app/data/conversation';
import { startOfToday, format } from 'date-fns';
import { capitalize } from 'lodash';

export const standUpResponse = (
  user_id: string,
  messages: ConversationMessage[]
) => [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `> *<@${user_id}>'s Daily Stand-Up*\n>${format(
        startOfToday(),
        'YYYY-MM-DD'
      )}`
    }
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `> *${capitalize(messages[0].question)}*\n>${capitalize(
        messages[0].reply.replace(/\n/g, '\n>').replace(/>>/g, '>')
      )}`
    }
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `> *${capitalize(messages[1].question)}\n>${capitalize(
        messages[1].reply.replace(/\n/g, '\n>').replace(/>>/g, '>')
      )}`
    }
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `> *${capitalize(messages[2].question)}*\n>${capitalize(
        messages[2].reply.replace(/\n/g, '\n>').replace(/>>/g, '>')
      )}`
    }
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `> *${capitalize(messages[3].question)}*\n>${capitalize(
        messages[3].reply.replace(/\n/g, '\n>').replace(/>>/g, '>')
      )}`
    }
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `> *${capitalize(messages[4].question)}*\n>${capitalize(
        messages[4].reply.replace(/\n/g, '\n>').replace(/>>/g, '>')
      )}`
    }
  }
];
