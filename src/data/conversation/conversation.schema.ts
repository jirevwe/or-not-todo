import { SchemaFactory, requiredTrimmedLowercaseString } from '@app/data/base';
import { SchemaTypes } from 'mongoose';
import generateUUID from 'uuid/v4';
import { ConversationState } from '@app/server/workers/bolt/utils';

export const ConversationSchema = SchemaFactory({
  time_ended: { type: SchemaTypes.Date },
  time_started: { type: SchemaTypes.Date, default: Date() },

  conversation_id: { ...requiredTrimmedLowercaseString, default: generateUUID },
  slack_user_id: { ...requiredTrimmedLowercaseString },
  state: {
    ...requiredTrimmedLowercaseString,
    enum: [...ConversationState],
    default: 'greet'
  }
});
