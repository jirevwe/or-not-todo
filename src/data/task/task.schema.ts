import { trimmedString, SchemaFactory, requiredTrimmedString } from '../base';

export const taskGroupEnum = ['none', 'family', 'work', 'bills'];
export const taskPriorityEnum = ['none', 'low', 'mid', 'high'];

const taskGroup = {
  ...requiredTrimmedString,
  enum: taskGroupEnum,
  default: 'none'
};

const priorityLevels = {
  ...trimmedString,
  enum: taskPriorityEnum,
  default: 'none'
};

const TaskSchema = SchemaFactory({
  group: { ...taskGroup },
  priority: { ...priorityLevels },
  tag: { ...trimmedString },
  end_date: { ...trimmedString },
  start_date: { ...trimmedString },
  name: { ...requiredTrimmedString },
  content: { ...requiredTrimmedString }
});

export default TaskSchema;
