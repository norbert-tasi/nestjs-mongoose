import { Schema } from 'mongoose';
import { AddressSchema } from './address.schema';
import { initSchema } from './schema.base';

const model = 'institute';

export const InstituteSchema = new Schema({
    code: { type: String },
    name: { type: String, required: true },
    active: { type: Boolean, default: false },
    address: AddressSchema,
    email: { type: String },
    webpage: { type: String },
    users: [ { type: Schema.Types.ObjectId, ref: 'user' } ]
});
initSchema(InstituteSchema, model);
