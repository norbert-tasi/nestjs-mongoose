import { Schema } from 'mongoose';
import { initSchema } from './schema.base';

const model = 'news';

export const NewsSchema = new Schema({
    text: { type: String },
    readable: { type: Boolean, default: false }
});

NewsSchema.index({ createdAt: -1 });
initSchema(NewsSchema, model);
