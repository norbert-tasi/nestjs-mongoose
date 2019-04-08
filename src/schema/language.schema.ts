import { Schema } from 'mongoose';
import { initSchema } from './schema.base';

const model = 'language';

export const LanguageSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String },
    active: { type: Boolean, default: false }
});
LanguageSchema.index({ code: 1 });
initSchema(LanguageSchema, model);
