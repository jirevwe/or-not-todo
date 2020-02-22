import { ConversationState, messages } from './utils';
import { IConversationModel, ConvoRepo } from '@app/data/conversation';
import { MessageEvent, SayFn } from '@slack/bolt';
import redis from '@app/common/services/redis';
import { endOfToday, startOfToday } from 'date-fns';

class Conversation {
  user: string;
  baseQuery: any;

  constructor(user: string) {
    this.user = user;
    this.baseQuery = { time_ended: undefined, slack_user_id: this.user };
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
    const update = { $set: { state } };
    return await ConvoRepo.updateWithOperators(this.baseQuery, update);
  }

  /**
   * Save a message to the conversation
   * @param value the slack message details
   */
  async saveMessage(value: MessageEvent) {
    const currentState = (await this.getConvo()).state;
    const index = ConversationState.indexOf(currentState);

    const query = { ...this.baseQuery, 'messages.index': index };
    const update = { $set: { 'messages.$.reply': value.text } };

    return await ConvoRepo.updateWithOperators(query, update);
  }

  /**
   * gets an ongoing conversation or starts a new conversation
   */
  async getConvo(): Promise<IConversationModel> {
    const convo = await ConvoRepo.getConversation(this.user);
    return convo === null
      ? await ConvoRepo.create({ slack_user_id: this.user, messages })
      : convo;
  }

  /**
   * Ends a conversation
   * @param conversation_id conversation id
   */
  async endConvo() {
    const update = { $set: { time_ended: Date() } };
    return await ConvoRepo.updateWithOperators(this.baseQuery, update);
  }
}

/**
 * Processes the message sent to bolt when any text that matches (\w+)
 * @param message the bolt message
 * @param say the SayFn used to reply to the user
 */
export const processMessage = async (message: MessageEvent, say: SayFn) => {
  const conversation = new Conversation(message.user);
  const defaultReply: string =
    "Haha... Smell you next time sucker!!!\n\nYou've completed today's standup, check back tomorrow";

  const today = startOfToday().getTime();
  const conversationKey = `${message.user}:${today}`.toLowerCase();
  const value = await redis.get(conversationKey);
  const timeTillEndOfDay = endOfToday().getTime() - new Date().getTime();
  const duration = Math.ceil(timeTillEndOfDay / 1000);

  if (value !== null) {
    say(defaultReply);
    return defaultReply;
  }

  const reply = await conversation.say();
  say(reply);
  const savedMessage = await conversation.saveMessage(message);
  const updatedConversation = await conversation.updateState();

  if (updatedConversation.state === 'end') {
    await redis.set(conversationKey, conversationKey, 'EX', duration);
    await conversation.endConvo();
  }
  return { reply, message: savedMessage, conversation: updatedConversation };
};
