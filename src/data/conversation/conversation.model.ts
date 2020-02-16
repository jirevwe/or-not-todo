import { Model } from '../base';

export interface IConversationModel extends Model {
  conversation_id: string;
  time_started: Date;
  time_ended: Date;
}
