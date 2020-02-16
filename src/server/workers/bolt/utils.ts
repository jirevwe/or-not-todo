import { Context, MessageEvent } from '@slack/bolt';

export type ConversationEvent =
  | 'greet'
  | 'prev_day_task'
  | 'prev_day_progress'
  | 'curr_day_task'
  | 'curr_day_progress'
  | 'blockers'
  | 'end';

export const ConversationState = [
  'greet',
  'prev_day_task',
  'prev_day_progress',
  'curr_day_task',
  'curr_day_progress',
  'blockers',
  'end'
];

export enum ConversationEvents {
  GREET = 'greet',

  PREV_DAY_TASK = 'prev_day_task',
  PREV_DAY_PROGRESS = 'prev_day_progress',

  CURR_DAY_TASK = 'curr_day_task',
  CURR_DAY_PROGRESS = 'curr_day_progress',

  ANY_BLOCKERS = 'any_blockers',

  END = 'end'
}

export type MyMessage = { action: ConversationEvent; message: MessageEvent };

export interface SaveParams {
  action: ConversationEvent;
  message: MessageEvent;
  context: Context;
}

export const save = async (params: SaveParams) => {
  const { context, ...rest } = params;
  return await context.updateConversation(rest);
};

export async function tryCatch(fn: Function) {
  try {
    await fn();
  } catch (error) {
    throw error;
  }
}
