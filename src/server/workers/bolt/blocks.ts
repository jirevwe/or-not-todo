import { ConversationMessage } from '@app/data/conversation';
import { format } from 'date-fns';

export const standUpResponse = (
  time_started: Date,
  user_id: string,
  messages: ConversationMessage[]
) => {
  const standUpDate = format(time_started, 'eeee do MMMM, yyyy');
  const reply = [
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `> *<@${user_id}>'s stand-up for ${standUpDate}*`
      }
    }
  ];

  for (let i = 0; i < 5; i++) {
    reply.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `> *${messages[i].question}*\n>${escapeReply(messages[i].reply)}`
      }
    });
  }
};

const escapeReply = (reply: string) =>
  reply.replace(/\n/g, '\n>').replace(/>>/g, '>');
