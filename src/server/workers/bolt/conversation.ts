import { ConversationState } from './utils';
import { IConversationModel, ConvoRepo } from '@app/data/conversation';
import { MessageRepo } from '@app/data/message';
import { MessageEvent } from '@slack/bolt';

export class Conversation {
  user: string;

  constructor(user: string) {
    this.user = user;
  }

  // gets a message that is returned to the user
  // based on the current state of the conversation
  async say(): Promise<string> {
    const { currentState: state } = await this.getState();
    switch (state) {
      case 'greet':
        return `Hey <@${this.user}>!\n\nWhat did you do yestesday :thinking_face:?`;
      case 'prev_day_task':
        return `What percentage of it were you able to complete :eye:?`;
      case 'prev_day_progress':
        return `So, <@${this.user}>, what are you working on today :thinking_face:?`;
      case 'curr_day_task':
        return `What part of it do you hope to achieve :thinking_face:?`;
      case 'curr_day_progress':
        return `Do you have any challenges :full_moon_with_face:?`;
      case 'any_blockers':
        return `Lit, do have a great day!!!`;
      default:
        return 'Wait... Huhn??';
    }
  }

  // gets the current and next states of the conversation
  async getState() {
    const currentState = (await this.getConvo()).state;
    const index = ConversationState.indexOf(currentState);
    const nextState = ConversationState[index + 1];
    return { currentState, nextState };
  }

  // updates the current state of the conversation
  async updateState(): Promise<IConversationModel> {
    const { nextState: state } = await this.getState();
    const query = { time_ended: undefined, slack_user_id: this.user };
    const update = { $set: { state } };
    return await ConvoRepo.updateWithOperators(query, update);
  }

  /**
   * Save a message to the conversation
   * @param value the slack message details
   */
  async saveMessage(value: MessageEvent) {
    const convo = await this.getConvo();
    return await MessageRepo.create({ conversation_id: convo._id, ...value });
  }

  /**
   * gets an ongoing conversation or starts a new conversation
   */
  async getConvo(): Promise<IConversationModel> {
    const convo = await ConvoRepo.getConversation(this.user);
    return convo === null
      ? await ConvoRepo.create({ slack_user_id: this.user })
      : convo;
  }

  /**
   * Ends a conversation
   * @param conversation_id conversation id
   */
  async endConvo() {
    const query = { time_ended: undefined, slack_user_id: this.user };
    const update = { $set: { time_ended: Date() } };

    return await ConvoRepo.updateWithOperators(query, update);
  }
}
