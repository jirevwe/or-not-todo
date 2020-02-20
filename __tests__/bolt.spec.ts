import db from '../src/server/db';
import { processMessage } from '../src/server/workers/bolt/conversation';
import { MessageEvent } from '@slack/bolt';
import faker from 'faker';

beforeAll(async () => {
  await db.connect();
  await db.connection.dropDatabase();
}, 12000);

afterAll(async () => {
  await db.connection.dropDatabase();
  await db.disconnect();
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
    replies.push((await chat).reply);
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
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn),
    await processMessage(message, sayFn)
  ];

  const replies = [];
  for (const chat of chats) {
    replies.push((await chat).conversation.state);
  }

  // confirm that both conversations ended
  expect(replies[5]).toMatch('end');
  expect(replies[11]).toMatch('end');
});
