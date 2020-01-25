import faker from 'faker';
import {
  CreateTaskPayload,
  taskGroupEnum,
  taskPriorityEnum
} from '../../src/data/task';
import supertest from 'supertest';
import timekeeper from 'timekeeper';
import { subDays, format } from 'date-fns';

const getRandom = items => items[Math.floor(Math.random() * items.length)];

const baseUrl = '/api/v1/tasks';

export const mockTaskPayload = (): CreateTaskPayload => ({
  content: faker.lorem.lines(10),
  name: faker.lorem.lines(1),
  group: getRandom(taskGroupEnum),
  priority: getRandom(taskPriorityEnum)
});

export const createMockTransactions = async (
  request: supertest.SuperTest<supertest.Test>,
  dateOffset: number = 1
) => {
  const date = format(subDays(Date(), dateOffset), 'DD/MM/YYYY');
  timekeeper.travel(date);

  const requests = Array.from({ length: 10 }).map(() => {
    const task = mockTaskPayload();
    return request.post(baseUrl).send(task);
  });

  const tasks = await Promise.all(requests);
  return tasks.map(it => it.body.data);
};
