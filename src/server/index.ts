// import metadata for es7 decorators support
import 'reflect-metadata';

// allow creation of aliases for directories
import 'module-alias/register';

import http from 'http';
import env from '@app/common/config/env';
import logger from '@app/common/services/logger/logger';
import App from './app';
import DB from './db';

const start = async () => {
  try {
    const app = new App();
    const appServer = app.build();
    const httpServer = http.createServer(appServer);

    await DB.connect();
    logger.message('📦  MongoDB Connected!');

    httpServer.listen(env.port);
    httpServer.on('listening', () =>
      logger.message(
        `🚀  ${env.service_name} running in ${env.app_env}. Listening on ` +
          env.port
      )
    );
  } catch (err) {
    logger.error(err, 'Fatal server error');
  }
};

start();
