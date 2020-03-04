import 'reflect-metadata';
import supertest from 'supertest';
import App from '../src/server/app';
import db from '../src/server/db';
import { OK } from 'http-status-codes';
import { mockTaskPayload, createMockTransactions } from './mocks';
import { format, toDate } from 'date-fns';

const baseUrl = '/api/v1/tasks';

let app: App;
let server: Express.Application;
let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  app = new App();
  await db.connect();
  await db.connection.dropDatabase();
  server = app.getServer().build();
  request = supertest(server);
}, 12000);

afterAll(async () => {
  await db.connection.dropDatabase();
  await app.closeDB();
});

it('creates a task', async () => {
  const task = mockTaskPayload();
  const { body } = await request
    .post(baseUrl)
    .send(task)
    .expect(OK);

  expect(task.name).toBe(body.data.name);
});

it('retrieves a task', async () => {
  const task = mockTaskPayload();
  const { body: taskBody } = await request
    .post(baseUrl)
    .send(task)
    .expect(OK);

  const { body } = await request
    .get(`${baseUrl}/${taskBody.data._id}`)
    .send(task)
    .expect(OK);

  expect(task.name).toBe(body.data.name);
});

it('updates a task', async () => {
  const task = mockTaskPayload();
  const { body: taskBody } = await request
    .post(baseUrl)
    .send(task)
    .expect(OK);

  expect(task.name).toBe(taskBody.data.name);

  const { body } = await request
    .post(`${baseUrl}/${taskBody.data._id}`)
    .send({ name: 'some new name' })
    .expect(OK);

  expect(body.data.name).toBe('some new name');
});

it('deletes a task', async () => {
  const task = mockTaskPayload();
  const { body: taskBody } = await request
    .post(baseUrl)
    .send(task)
    .expect(OK);

  const { body } = await request
    .delete(`${baseUrl}/${taskBody.data._id}`)
    .expect(OK);

  expect(body.data).toHaveProperty('deleted_at');
});

it.only("gets all yesterday's tasks", async () => {
  // create tasks for yesterday and today
  const { date: yesterday } = await createMockTransactions(request);
  const { date: today } = await createMockTransactions(request, 2);

  const { body: todayTasks } = await request
    .get(`${baseUrl}?period=today`)
    .expect(OK);

  for (const task of todayTasks.data) {
    const taskDate = format(toDate(Date.parse(task.created_at)), 'dd/MM/yyyy');
    expect(taskDate).toBe(today);
  }

  const dateRange = `date_range[start]=${yesterday}&date_range[end]=${today}`;
  const { body: yesterdayTasks } = await request
    .get(`${baseUrl}?range=${dateRange}`)
    .expect(OK);

  for (const task of yesterdayTasks.data) {
    const taskDate = format(toDate(Date.parse(task.created_at)), 'dd/MM/yyyy');
    expect(taskDate).toBe(yesterday);
  }
});
