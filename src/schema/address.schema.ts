import { Schema } from 'mongoose';

const model = 'address';

export const AddressSchema = new Schema({
    zip: { type: String },
    town: { type: String },
    country: { type: String },
    str: { type: String },
    phone: { type: String },
    fax: { type: String }
});
AddressSchema.index({ code: 1 });
// initSchema(AddressSchema, model);
