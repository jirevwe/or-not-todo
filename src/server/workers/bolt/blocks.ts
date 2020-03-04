import { ConversationMessage } from '@app/data/conversation';
import { format } from 'date-fns';
import { capitalize } from 'lodash';

export const standUpResponse = (
  time_started: Date,
  user_id: string,
  messages: ConversationMessage[]
) => [
  {
    type: 'divider'
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `> *<@${user_id}>'s Daily Stand-Up for ${format(
        time_started,
        'eeee do MMMM, yyyy'
      )}*`
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
      text: `> *${capitalize(messages[1].question)}*\n>${capitalize(
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
