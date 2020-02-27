import bolt from './bolt';
import env from '@app/common/config/env';
import db from '../db';
import { sessionsAgenda, standUpsAgenda } from './agenda';
import logger from '@app/common/services/logger';

export const startWorker = async () => {
  try {
    if (!env.port)
      throw new Error('Worker http port not specified. Exiting...');

    // connect db
    await db.connect();

    // start agenda
    await sessionsAgenda.start();
    sessionsAgenda.on('ready', () =>
      logger.message('⏳ Sessions Agenda ready')
    );

    // start agenda
    await standUpsAgenda.start();
    standUpsAgenda.on('ready', () =>
      logger.message('⏳ Standups Agenda ready')
    );

    // run the job every midnight
    await sessionsAgenda.every('0 9 * * *', 'RESET_SESSIONS');

    // run this job at 9am daily
    await standUpsAgenda.every('0 9 * * *', 'TRIGGER_STANDUPS');

    // start Bolt
    await bolt.start(env.port);
    console.log(`⚡ Bolt app is running on port ${env.port}!!!`);

    db.connection.once('close', async () => {
      await sessionsAgenda.stop();
      await standUpsAgenda.stop();
    });
  } catch (e) {
    process.exit(1);
  }
};

/**
 * Stops the worker
 */
export const stopWorker = async () => {
  process.exit(1);
};
