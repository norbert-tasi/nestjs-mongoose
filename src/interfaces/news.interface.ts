import { INews } from '@model/sys/news';
import { ModelDocument } from './Model.interface';

export interface News extends ModelDocument, INews {}
