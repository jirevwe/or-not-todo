import {
  SchemaFactory,
  requiredTrimmedString,
  trimmedLowercaseString
} from '@app/data/base';
import { SchemaTypes, Schema } from 'mongoose';
import generateUUID from 'uuid/v4';
import { ConversationState } from '@app/server/workers/bolt/utils';

export const ConversationMessageSchema = new Schema({
  _id: { ...requiredTrimmedString, default: generateUUID },
  question: { ...requiredTrimmedString, required: true },
  reply: { ...trimmedLowercaseString },
  index: { type: SchemaTypes.Number }
});

export const ConversationSchema = SchemaFactory({
  time_ended: { type: SchemaTypes.Date },
  time_started: { type: SchemaTypes.Date, default: Date() },

  conversation_id: { ...requiredTrimmedString, default: generateUUID },
  slack_user_id: { ...requiredTrimmedString },
  messages: [ConversationMessageSchema],
  state: {
    ...requiredTrimmedString,
    enum: ConversationState,
    default: 'greet'
  }
});
