import { ITask } from '@model/sys/task';
import { ModelDocument } from './Model.interface';

export interface Task extends ModelDocument, ITask {}
