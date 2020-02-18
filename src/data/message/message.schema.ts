import { SchemaFactory, trimmedString } from '@app/data/base';

export const MessageSchema = SchemaFactory({
  conversation_id: { ...trimmedString },

  // slack fields
  type: { ...trimmedString },
  text: { ...trimmedString },
  user: { ...trimmedString },
  team: { ...trimmedString },
  channel: { ...trimmedString },
  time_sent: { ...trimmedString },
  channel_type: { ...trimmedString },
  client_msg_id: { ...trimmedString },
  event_time_sent: { ...trimmedString }
});
