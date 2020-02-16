import { BaseRepository } from '../base';
import { IConversationModel } from './conversation.model';
import { ConversationSchema } from './conversation.schema';

export class ConversationRepository extends BaseRepository<IConversationModel> {
  constructor() {
    super('Conversation', ConversationSchema);
  }

  /**
   * Returns a Mongo query object that can be used for getting an existing conversation by it's conversation_id
   * @param id the conversation id
   */
  private query(id: string) {
    return {
      conversation_id: id,
      deleted_at: undefined
    };
  }

  /**
   * Returns the conversation or null
   * @param conversation_id the conversation id
   */
  async getByConversationId(conversation_id: string) {
    const query = this.query(conversation_id);
    return await this.model.findOne(query).lean();
  }

  /**
   * Returns the conversation or null
   * @param conversation_id the conversation id
   */
  async getConversation(slack_user_id: string) {
    const query = { time_ended: undefined, slack_user_id };
    return await this.model.findOne(query).lean();
  }
}

/**
 * Wallet Repository class instance shared across the app.
 */
export const ConvoRepo = new ConversationRepository();
