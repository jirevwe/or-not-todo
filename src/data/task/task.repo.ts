import { ITaskModel, DatePeriod, DateRange } from './task.model';
import TaskSchema from './task.schema';
import { BaseRepository } from '../base';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear
} from 'date-fns';

export class TaskRepository extends BaseRepository<ITaskModel> {
  constructor() {
    super('Task', TaskSchema);
  }

  /**
   * Returns a MongoDB date range object for querying transactions based on creation date
   * @param period The period in which the transactions occured
   * @param date_range Required if period is `range`. Start and optional end date of the transactions
   */
  private getDateRange(period: DatePeriod, date_range?: DateRange) {
    const now = new Date();

    switch (period) {
      case 'today':
        return {
          $gte: startOfDay(now),
          $lte: endOfDay(now)
        };
      case 'week':
        return {
          $gte: startOfWeek(now),
          $lte: endOfWeek(now)
        };
      case 'month':
        return {
          $gte: startOfMonth(now),
          $lte: endOfMonth(now)
        };
      case 'year':
        return {
          $gte: startOfYear(now),
          $lte: endOfYear(now)
        };
      case 'range':
        const { start, end } = date_range;

        if (!start) return null;

        const range = {
          $gte: startOfDay(start),
          $lte: endOfDay(end || start)
        };

        return range;
      case 'all':
      default:
        return null;
    }
  }

  getTasks(query: any) {
    const dateRange = this.getDateRange(query.period, query.date_range);
    const dateQuery = dateRange ? { created_at: dateRange } : {};
    return this.all({ conditions: dateQuery });
  }
}

export const TaskRepo = new TaskRepository();
