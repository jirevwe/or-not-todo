import { Logger, LogLevel } from '@slack/bolt';
import bunyan from 'bunyan';

class SlackLogger implements Logger {
  private log: bunyan;
  constructor() {
    this.log = bunyan.createLogger({ name: 'slack:bolt' });
  }

  debug(...msg: any[]): void {
    this.log.debug(msg);
  }

  info(...msg: any[]): void {
    this.log.info(msg);
  }

  warn(...msg: any[]): void {
    this.log.warn(msg);
  }

  setLevel(level: LogLevel): void {
    this.log.level(level);
  }

  getLevel(): LogLevel {
    return LogLevel.DEBUG;
  }

  error(...msg: any[]): void {
    this.log.error(msg);
  }

  setName(name: string): void {
    // no-op
  }
}

export default new SlackLogger();
