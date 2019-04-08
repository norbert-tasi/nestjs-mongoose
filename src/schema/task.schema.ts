import { TaskStatus } from '@enum/task-status.enum';
import { TaskType } from '@enum/task-type.enum';
import { TaskWorkType } from '@enum/task-work-type.enum';
import { Schema } from 'mongoose';
import { initSchema } from './schema.base';

const model = 'task';

export const TaskSchema = new Schema({
    type: { type: String, enum: Object.keys(TaskType), required: true },
    targetId: { type: String, required: true },
    sourceLang: { type: String, required: true },
    status: { type: String, enum: Object.keys(TaskStatus), default: TaskStatus.OPEN },
    workType: { type: String, enum: Object.keys(TaskWorkType), default: TaskWorkType.VALIDATE },
    owner: { type: String }
});
TaskSchema.index({ updated: -1, sourceLang: 1 });
TaskSchema.index({ owner: 1, updated: 1 });
initSchema(TaskSchema, model);
