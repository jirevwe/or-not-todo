import { ConversationStore } from '@slack/bolt';
import { IConversationModel, ConvoRepo } from '@app/data/conversation';
import { MessageRepo } from '@app/data/message';
import { MyMessage } from './utils';

/**
 * Keeps tractk of conversation state
 */
class ConvoStore implements ConversationStore {
  async set(_: string, value: MyMessage): Promise<any> {
    const convo = await this.startConvo(value.message.user);
    switch (value.action) {
      case 'greet':
        await MessageRepo.create({ conversation_id: convo._id, ...value });
        break;
      case 'prev_day_task':
        break;
      case 'end':
        this.endConvo(value.message.user);
        break;
      default:
        return;
    } 
  }

  async get(slack_user_id: string): Promise<IConversationModel> {
    return await ConvoRepo.getConversation(slack_user_id);
  }

  /**
   * Starts a new conversation, creates a new conversation object
   * */
  async startConvo(slack_user_id: string): Promise<IConversationModel> {
    const convo = await ConvoRepo.getConversation(slack_user_id);
    return convo !== null ? convo : await ConvoRepo.create({ slack_user_id });
  }

  /**
   * Ends a conversation
   * @param conversation_id conversation id
   */
  async endConvo(slack_user_id: string) {
    return await ConvoRepo.updateWithOperators(
      { time_ended: undefined, slack_user_id },
      {
        $set: { time_ended: Date() }
      }
    );
  }
}

export default new ConvoStore();
