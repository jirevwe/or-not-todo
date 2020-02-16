import { SchemaFactory, requiredTrimmedLowercaseString } from '@app/data/base';

export const MessageSchema = SchemaFactory({
  conversation_id: { ...requiredTrimmedLowercaseString },

  // slack fields
  type: { ...requiredTrimmedLowercaseString },
  text: { ...requiredTrimmedLowercaseString },
  user: { ...requiredTrimmedLowercaseString },
  team: { ...requiredTrimmedLowercaseString },
  channel: { ...requiredTrimmedLowercaseString },
  time_sent: { ...requiredTrimmedLowercaseString },
  channel_type: { ...requiredTrimmedLowercaseString },
  client_msg_id: { ...requiredTrimmedLowercaseString },
  event_time_sent: { ...requiredTrimmedLowercaseString }
});
