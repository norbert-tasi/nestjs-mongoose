import { FormType } from '@enum/form-type.enum';
import { Schema } from 'mongoose';
import { initSchema } from './schema.base';

const model = 'form';

export const FormSchema = new Schema({
    formtype: { type: String, enum: Object.keys(FormType), required: true },
    name: { type: String, required: true },
    description: { type: String },
    rows: [ { question: { type: Schema.Types.ObjectId, ref: 'question' }, required: Boolean } ]
});
initSchema(FormSchema, model);
