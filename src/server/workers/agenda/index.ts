import Agenda, { Job } from 'agenda';
import mongoose from 'mongoose';
import redis from '@app/common/services/redis';
import logger from '@app/common/services/logger';

const resetSessions = async (job: Job<any>, done: (err?: Error) => void) => {
  const { name } = job.attrs;
  const jobName = name.toLowerCase();

  try {
    await redis.flushall('ASYNC');
    logger.message('standup records cleared');
    done();
  } catch (error) {
    logger.error(error, {
      info: `An error occured while executing ${jobName}`
    });
    done(error);
  }
};

const agenda = new Agenda({
  //@ts-ignore
  mongo: mongoose.connection,
  db: {
    collection: 'standups'
  }
});

agenda.define('RESET_SESSIONS', resetSessions);

export default agenda;
