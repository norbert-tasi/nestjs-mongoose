import { IQuestion } from '@model/sys/question';
import { ModelDocument } from './Model.interface';

export interface Question extends ModelDocument, IQuestion {}
