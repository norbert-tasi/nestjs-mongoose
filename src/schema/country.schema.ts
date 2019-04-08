import { Schema } from 'mongoose';
import { initSchema } from './schema.base';

const model = 'country';

export const CountrySchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String },
    callno: { type: String },
    lang: { type: String },
    active: { type: Boolean, default: false }
});
CountrySchema.index({ code: 1 });
initSchema(CountrySchema, model);
