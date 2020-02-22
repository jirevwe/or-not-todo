import db from '../src/server/db';
import { processMessage } from '../src/server/workers/bolt/conversation';
import { MessageEvent } from '@slack/bolt';
import faker from 'faker';
import redis from '../src/common/services/redis';
import timekeeper from 'timekeeper';
import { addDays } from 'date-fns';

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
    await processMessage(message, sayFn),
    await processMessage(message, sayFn)
  ];

  const replies = [];
  for (const chat of chats) {
    const sentChat = await chat;
    // @ts-ignore
    replies.push(typeof sentChat !== 'string' ? sentChat.reply : sentChat);
  }

  expect(replies[0]).toMatch(/What did you do yestesday :thinking_face:?/);
  expect(replies[1]).toMatch(
    /What percentage of it were you able to complete :eye:?/
  );
  expect(replies[2]).toMatch(/what are you working on today :thinking_face:?/);
  expect(replies[3]).toMatch(
    /What part of it do you hope to achieve :thinking_face:?/
  );
  expect(replies[4]).toMatch(
    /Do you have any challenges :full_moon_with_face:?/
  );
  expect(replies[5]).toMatch(/Lit, do have a great day!!!/);
});

it('completes a chat session, replies with a generic message', async () => {
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
    await processMessage(message, sayFn),
    await processMessage(message, sayFn)
  ];

  const replies = [];
  for (const chat of chats) {
    const sentChat = await chat;
    replies.push(
      // @ts-ignore
      typeof sentChat !== 'string' ? sentChat.conversation.state : sentChat
    );
  }

  await processMessage(message, sayFn);

  expect(replies[5]).toMatch('end');
});

it('it clears all the sessions after midnight', async () => {
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
    await processMessage(message, sayFn),
    await processMessage(message, sayFn)
  ];

  const replies = [];
  for (const chat of chats) {
    const sentChat = await chat;
    replies.push(
      // @ts-ignore
      typeof sentChat !== 'string' ? sentChat.conversation.state : sentChat
    );
  }

  // send another message
  await processMessage(message, sayFn);

  expect(replies[5]).toMatch('end');

  // travel tio this time tomorrow
  timekeeper.travel(addDays(new Date(), 1));

  // send a message tomorrow
  const tomorrowsChat = await processMessage(message, sayFn);

  // @ts-ignore
  expect(tomorrowsChat.reply).toMatch(
    /What did you do yestesday :thinking_face:?/
  );
});
