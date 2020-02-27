import { Model } from '../base';
import { ConversationEvent } from '@app/server/workers/bolt/utils';

export interface IConversationModel extends Model {
  messages: [ConversationMessage];
  state: ConversationEvent;
  conversation_id: string;
  slack_user_id: string;
  time_started: Date;
  time_ended: Date;
}

export interface ConversationMessage {
  question: string;
  index: number;
  reply: string;
  _id: string;
}
