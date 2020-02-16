import { Model } from '../base';

export interface IMessageModel extends Model {
  // slack messsage details
  type: string;
  text: string;
  user: string;
  team: string;
  channel: string;
  time_sent: string;
  channel_type: string;
  client_msg_id: string;
  event_time_sent: string;
}
