import { OptionType } from '@enum/option-type.enum';
import { Schema } from 'mongoose';
import { initSchema } from './schema.base';

const model = 'option';

export const KeyLabelSchema = new Schema({
    key: { type: String, required: true },
    label: { type: String, required: true }
});

export const OptionSchema = new Schema({
    name: { type: String, required: true },
    kind: { type: String, enum: Object.keys(OptionType), required: true, default: OptionType.NORMAL },
    values: [ KeyLabelSchema ]
});
initSchema(OptionSchema, model);
