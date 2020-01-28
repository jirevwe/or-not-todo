import bolt from './bolt';
import env from '@app/common/config/env';

export const startWorker = async () => {
  try {
    if (!env.worker_port)
      throw new Error('Worker http port not specified. Exiting...');

    await bolt.start(env.worker_port);
    console.log('⚡️ Bolt app is running!');
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
