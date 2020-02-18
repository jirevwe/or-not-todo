import bolt from './bolt';
import env from '@app/common/config/env';
import db from '../db';

export const startWorker = async () => {
  try {
    if (!env.port)
      throw new Error('Worker http port not specified. Exiting...');

    await db.connect();

    await bolt.start(env.port);
    console.log(`⚡️ Bolt app is running on port ${env.port}!!!`);
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
