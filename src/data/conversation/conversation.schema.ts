import { SchemaFactory, requiredTrimmedLowercaseString } from '@app/data/base';
import { SchemaTypes } from 'mongoose';

export const ConversationSchema = SchemaFactory({
  time_ended: { type: SchemaTypes.Date },
  conversation_id: { ...requiredTrimmedLowercaseString },
  time_started: { type: SchemaTypes.Date, default: Date() }
});
