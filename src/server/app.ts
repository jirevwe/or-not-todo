import express, { Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import responseTime from 'response-time';
import requestID from 'express-request-id';
import cors from 'cors';
import helmet from 'helmet';
import container from '@app/common/config/ioc';
import env from '../common/config/env';
import loggerMiddleware from './middlewares/requestLogger';
import jsend from './middlewares/jsend';
import { logResponseBody } from './middlewares/logResponseBody';
import db from './db';
import redis from '@app/common/services/redis';

export default class App {
  private server: InversifyExpressServer;

  constructor() {
    const serverOptions = {
      rootPath: env.api_version
    };

    this.server = new InversifyExpressServer(container, null, serverOptions);

    this.registerMiddlewares();
    this.registerHandlers();
  }

  /**
   * Registers middlewares on the application server
   */
  private registerMiddlewares() {
    this.server.setConfig((app: Application) => {
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));

      app.disable('x-powered-by');
      app.use(helmet());
      app.use(cors());
      app.use(responseTime());
      app.use(requestID());

      app.use(loggerMiddleware);
      app.use(logResponseBody);

      app.use(jsend);
    });
  }

  /**
   * Registers utility handlers
   */
  private registerHandlers() {
    this.server.setErrorConfig((app: Application) => {
      app.get('/', (req, res) => {
        res.status(200).json({ status: 'UP' });
      });

      app.use((req, res, next) => {
        res.status(404).send("Whoops! Route doesn't exist.");
      });
    });
  }

  getServer = () => this.server;

  /**
   * Applies all routes and configuration to the server, returning the express application server.
   */
  build() {
    const app = this.server.build();
    return app;
  }

  async closeDB() {
    await db.disconnect();
    await redis.quit();
  }
}
