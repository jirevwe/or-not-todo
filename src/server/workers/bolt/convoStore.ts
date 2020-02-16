import { ConversationStore } from '@slack/bolt';
import { IConversationModel, ConversationRepo } from '@app/data/conversation';
import { IMessageModel, MessageRepo } from '@app/data/message';
import { MyMessage } from './utils';

/**
 * Keeps tractk of conversation state
 */
class ConvoStore implements ConversationStore {
  conversation: IConversationModel;
  messages: IMessageModel[];

  async set(_: string, value: MyMessage): Promise<any> {
    switch (value?.action) {
      case 'start':
        const convo = await this.startConvo();
        await MessageRepo.create({ conversation_id: convo._id, ...value });
        break;
      case 'step_1':
        break;
      case 'end':
        this.endConvo();
        break;
      default:
        return;
    }
  }

  async get(_: string): Promise<any> {
    // load the conversation
    this.conversation = await ConversationRepo.getCurrentConversation();

    // load and cache the messages
    this.messages = await MessageRepo.getByConversationId(
      this.conversation._id
    );
  }

  /**
   * Starts a new conversation, creates a new conversation object
   * */
  async startConvo(): Promise<IConversationModel> {
    return this.conversation !== null
      ? this.conversation
      : await ConversationRepo.create({});
  }

  /**
   * Ends a conversation
   * @param conversation_id conversation id
   */
  async endConvo() {
    return await ConversationRepo.updateWithOperators(
      { time_ended: undefined },
      {
        $set: { time_ended: Date() }
      }
    );
  }
}

export default new ConvoStore();
