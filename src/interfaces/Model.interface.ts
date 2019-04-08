import { Document } from 'mongoose';

export interface ModelDocument extends Document {
    createdBy: string;
    updatedBy: string;
    merge(data: Object, opts?: Object);
    historicalClear(callback: Function);
}
