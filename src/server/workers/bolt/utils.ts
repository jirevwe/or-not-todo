import { Context, MessageEvent } from '@slack/bolt';

export type Action = 'start' | 'end' | 'step_1' | 'step_2' | 'step_3';

export type MyMessage = { action: Action; message: MessageEvent };

export interface SaveParams {
  context: Context;
  action: Action;
  message: MessageEvent;
}

export const save = async (params: SaveParams) => {
  return await params.context.updateConversation({
    action: params.action,
    ...params.message
  });
};
