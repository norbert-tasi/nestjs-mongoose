import { StudyStatus } from '@enum/study-status.enum';
import { Schema } from 'mongoose';
import { initSchema } from './schema.base';

const model = 'study';

export const VisitSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    delay: { type: Number, required: true },
    validTill: { type: Number, default: 14 },
    forms: [ { type: Schema.Types.ObjectId, ref: 'form' } ]
});

export const StudySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: false, default: Date.now },
    endDate: { type: Date },
    length: { type: Number, default: 360 },
    visits: [ VisitSchema ],
    status: { type: String, enum: Object.keys(StudyStatus), required: true, default: StudyStatus.INPROGRESS }
});
initSchema(StudySchema, model);
