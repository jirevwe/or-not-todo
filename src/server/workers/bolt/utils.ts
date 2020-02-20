import { Context, MessageEvent } from '@slack/bolt';

export type ConversationEvent =
  | 'greet'
  | 'prev_day_task'
  | 'prev_day_progress'
  | 'curr_day_task'
  | 'curr_day_progress'
  | 'any_blockers'
  | 'end';

export const ConversationState = [
  'greet',
  'prev_day_task',
  'prev_day_progress',
  'curr_day_task',
  'curr_day_progress',
  'any_blockers',
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

export const messages = Object.seal([
  { index: 0, question: 'What did you do yestesday :thinking_face:?' },
  {
    index: 1,
    question: 'What percentage of it were you able to complete :eye:?'
  },
  {
    index: 2,
    question: 'what are you working on today :thinking_face:?'
  },
  {
    index: 3,
    question: 'What part of it do you hope to achieve :thinking_face:?'
  },
  {
    index: 4,
    question: 'Do you have any challenges :full_moon_with_face:?'
  },
  {
    index: 5,
    question: 'Lit, do have a great day!!!'
  }
]);

export type MyMessage = { action: ConversationEvent; message: MessageEvent };

export interface SaveParams {
  action: ConversationEvent;
  message: MessageEvent;
  context: Context;
}

export async function tryCatch(fn: Function) {
  try {
    await fn();
  } catch (error) {
    throw error;
  }
}
