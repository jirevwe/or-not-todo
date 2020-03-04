import db from '../src/server/db';
import { processMessage } from '../src/server/workers/bolt/conversation';
import { MessageEvent } from '@slack/bolt';
import faker from 'faker';
import redis from '../src/common/services/redis';
import timekeeper from 'timekeeper';
import { addDays } from 'date-fns';
import { Conversation } from '../src/server/workers/bolt/conversation';

beforeEach(async () => {
  await db.connect();
  await db.connection.dropDatabase();
  await redis.flushall('ASYNC');
}, 12000);

afterEach(async () => {
  await db.connection.dropDatabase();
  await db.disconnect();
});

afterAll(async () => {
  await redis.quit();
});

const sayFn = (message: string) => {
  console.log(message);
};

it('completes a chat session', async () => {
  let conversation = new Conversation('RT');
  sayFn(await conversation.say());

  const message: MessageEvent = {
    channel: faker.lorem.slug(),
    ts: faker.lorem.slug(),
    type: 'message',
    user: 'RT',
    text: faker.lorem.slug()
  };

  const chats = [
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn)
  ];

  for (const chat of chats) await chat;

  const reply = await processMessage(message, sayFn);
  const replies =
    typeof reply !== 'string' ? reply.conversation.messages : reply;

  //@ts-ignore
  expect(replies[0].question).toMatch(
    /What did you do yestesday :thinking_face:?/
  );
  //@ts-ignore
  expect(replies[1].question).toMatch(
    /What percentage of it were you able to complete :eye:?/
  );
  //@ts-ignore
  expect(replies[2].question).toMatch(
    /what are you working on today :thinking_face:?/
  );
  //@ts-ignore
  expect(replies[3].question).toMatch(
    /What part of it do you hope to achieve :thinking_face:?/
  );
  //@ts-ignore
  expect(replies[4].question).toMatch(
    /Do you have any challenges :full_moon_with_face:?/
  );
  //@ts-ignore
  expect(replies[5].question).toMatch(/Lit, do have a great day!!!/);
});

it('completes a chat session, replies with a generic message', async () => {
  let conversation = new Conversation('RT');
  sayFn(await conversation.say());

  const message: MessageEvent = {
    channel: faker.lorem.slug(),
    ts: faker.lorem.slug(),
    type: 'message',
    user: 'RT',
    text: faker.lorem.slug()
  };

  const chats = [
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn)
  ];

  for (const chat of chats) await chat;

  const reply = await processMessage(message, sayFn);
  expect(reply).toMatch(
    /You've completed today's standup, check back tomorrow/
  );
});

it('it clears all the sessions after midnight', async () => {
  let conversation = new Conversation('RT');
  sayFn(await conversation.say());

  const message: MessageEvent = {
    channel: faker.lorem.slug(),
    ts: faker.lorem.slug(),
    type: 'message',
    user: 'RT',
    text: faker.lorem.slug()
  };

  const chats = [
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn)
  ];

  for (const chat of chats) await chat;

  const reply = await processMessage(message, sayFn);
  expect(reply).toMatch(
    /You've completed today's standup, check back tomorrow/
  );

  // travel to this time tomorrow
  timekeeper.travel(addDays(new Date(), 1));

  // start another conversation
  conversation = new Conversation('RT');
  sayFn(await conversation.say());

  // send a message tomorrow
  const tomorrowsChat = await processMessage(message, sayFn);

  // @ts-ignore
  expect(tomorrowsChat.conversation.messages[0].question).toMatch(
    /What did you do yestesday :thinking_face:?/
  );
});
