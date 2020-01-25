import { Model } from '../base';

export interface ITaskModel extends Model {
  tag: string;
  name: string;
  content: string;
  priority: string;
  group: TaskGroup;
  end_date: string;
  start_date: string;
}

export type TaskGroup = 'none' | 'family' | 'work' | 'bills';

export interface CreateTaskPayload {
  name: string;
  content: string;
  priority?: string;
  group?: TaskGroup;
}

export type DatePeriod = 'today' | 'week' | 'month' | 'year' | 'range' | 'all';

export interface DateRange {
  start: Date;
  end: Date;
}
