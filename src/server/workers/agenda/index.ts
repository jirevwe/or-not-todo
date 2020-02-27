import Agenda, { Job } from 'agenda';
import mongoose from 'mongoose';
import redis from '@app/common/services/redis';
import logger from '@app/common/services/logger';
import axios from 'axios';
import env from '@app/common/config/env';
import { Conversation } from '../bolt/conversation';

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

const triggerStandups = async (job: Job<any>, done: (err?: Error) => void) => {
  const { name } = job.attrs;
  const jobName = name.toLowerCase();

  // build URLs
  const getChannelmembersUrl = `${env.slack_members_url}?token=${env.slack_bot_token}&channel=${env.slack_standups_channel}`;
  const getSendChatMessageUrl = (member_id: string, greeting: string) =>
    `${env.slack_post_message_url}?token=${env.slack_bot_token}&channel=${member_id}&text=${greeting}`;

  try {
    const { data } = await axios.get(getChannelmembersUrl);
    const members = data.members.filter(it => it !== 'usr96e9my');

    for (const member of members) {
      const conversation = new Conversation(member);
      const greeting = await conversation.say();

      await axios.get(getSendChatMessageUrl(member, greeting));
    }

    logger.message('Standup messages sent');
    done();
  } catch (error) {
    logger.error(error, {
      info: `An error occured while executing ${jobName}`
    });
    done(error);
  }
};

const _sessionsAgenda = new Agenda({
  //@ts-ignore
  mongo: mongoose.connection,
  db: {
    collection: 'sessions'
  }
});

const _standUpsAgenda = new Agenda({
  //@ts-ignore
  mongo: mongoose.connection,
  db: {
    collection: 'standups'
  }
});

_sessionsAgenda.define('RESET_SESSIONS', resetSessions);
_standUpsAgenda.define('TRIGGER_STANDUPS', triggerStandups);

export const sessionsAgenda = _sessionsAgenda;
export const standUpsAgenda = _standUpsAgenda;
