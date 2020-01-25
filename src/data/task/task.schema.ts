import { Schema } from 'mongoose';
import { trimmedLowercaseString, SchemaFactory } from '../base';

export const taskGroupEnum = ['none', 'family', 'work', 'bills'];
export const taskPriorityEnum = ['none', 'low', 'mid', 'high'];

const taskGroup = {
  ...trimmedLowercaseString,
  enum: taskGroupEnum,
  default: 'none'
};

const priorityLevels = {
  ...trimmedLowercaseString,
  enum: taskPriorityEnum,
  default: 'none'
};

export declare const requiredTrimmedLowercaseString: {
  type: typeof Schema.Types.String;
  lowercase: boolean;
  required: true;
  trim: boolean;
};

const TaskSchema = SchemaFactory({
  group: { ...taskGroup },
  priority: { ...priorityLevels },
  tag: { ...trimmedLowercaseString },
  end_date: { ...trimmedLowercaseString },
  start_date: { ...trimmedLowercaseString },
  name: { ...requiredTrimmedLowercaseString },
  content: { ...requiredTrimmedLowercaseString }
});

export default TaskSchema;
