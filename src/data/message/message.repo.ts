import { BaseRepository } from '../base';
import { IMessageModel } from './message.model';
import { MessageSchema } from './message.schema';

export class MessageRepository extends BaseRepository<IMessageModel> {
  constructor() {
    super('Message', MessageSchema);
  }

  /**
   * Returns a Mongo query object that can be used for getting any existing messages by it's conversation_id
   * @param id the conversation id
   */
  private query(id: string) {
    return {
      conversation_id: id,
      deleted_at: undefined
    };
  }

  /**
   * Returns the all the messages in a conversation or an empty list
   * @param conversation_id the conversation id
   */
  async getByConversationId(conversation_id: string): Promise<IMessageModel[]> {
    const query = this.query(conversation_id);
    return await this.model.find(query).lean();
  }
}

/**
 * Wallet Repository class instance shared across the app.
 */
export const MessageRepo = new MessageRepository();
