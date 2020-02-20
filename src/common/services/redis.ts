import redis, { RedisClient } from 'redis';
import { promisify } from 'util';
import env from '../config/env';
import logger from './logger/logger';

export class RedisService {
  redis: RedisClient;

  del: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
  expireat: (key: string, timestamp: number) => Promise<number>;
  incrby: (key: string, increment: number) => Promise<number>;
  hdel: (hash: string, field: string) => Promise<any>;
  hget: (hash: string, field: string) => Promise<string>;
  hgetall: (key: string) => Promise<object>;
  hset: (hash: string, field: string, value: any) => Promise<any>;
  set: (
    key: string,
    value: any,
    mode?: string,
    duration?: number
  ) => Promise<any>;
  get: (key: string) => Promise<string>;
  quit: () => Promise<void>;

  constructor() {
    this.redis = redis.createClient({ url: env.redis_url });

    const commands = [
      'del',
      'expire',
      'expireat',
      'incrby',
      'hdel',
      'hget',
      'hgetall',
      'hset',
      'set',
      'get',
      'quit'
    ];

    // Promisify all the specified commands
    commands.forEach(command => {
      this[command] = promisify(this.redis[command]).bind(this.redis);
    });

    this.redis.on('ready', async () => {
      logger.message('🐳  Redis Connected!');
    });

    this.redis.on('error', err => {
      logger.error(err, 'An error occured with the Redis client.');
    });
  }
}

export default new RedisService();
