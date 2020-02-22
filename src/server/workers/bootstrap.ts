import bolt from './bolt';
import env from '@app/common/config/env';
import db from '../db';
import agenda from './agenda';
import logger from '@app/common/services/logger';

export const startWorker = async () => {
  try {
    if (!env.port)
      throw new Error('Worker http port not specified. Exiting...');

    // connect db
    await db.connect();

    // start agenda
    agenda.on('ready', () => logger.message('⏳  Standups Agenda ready'));

    // start Bolt
    await bolt.start(env.port);
    console.log(`⚡️ Bolt app is running on port ${env.port}!!!`);

    db.connection.once('close', async () => {
      await agenda.stop();
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
