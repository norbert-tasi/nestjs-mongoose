import { QuestionType } from '@enum/question-type.enum';
import { Schema } from 'mongoose';
import { initSchema } from './schema.base';

const model = 'question';

export const QuestionSchema = new Schema(
    {
        key: { type: String },
        label: { type: String, required: true },
        description: { type: String }
    },
    { discriminatorKey: 'kind' }
);

initSchema(QuestionSchema, model);

export function questionDiscriminators(question) {
    question.discriminator(QuestionType.Textbox, TextSchema);
    question.discriminator(QuestionType.Longtext, LongTextSchema);
    question.discriminator(QuestionType.Email, EmailSchema);
    question.discriminator(QuestionType.Checkbox, CheckboxSchema);
    question.discriminator(QuestionType.Numberbox, NumberSchema);
    question.discriminator(QuestionType.Datebox, DateSchema);
    question.discriminator(QuestionType.Range, RangeSchema);
    question.discriminator(QuestionType.Radio, RadioSchema);
    question.discriminator(QuestionType.Select, SelectSchema);
    question.discriminator(QuestionType.Switch, SwitchSchema);
    question.discriminator(QuestionType.Constant, ConstantSchema);

    /** Groups **/
    question.discriminator(QuestionType.Formula, FormulaSchema);
    question.discriminator(QuestionType.Relation, RelationSchema);
    question.discriminator(QuestionType.Repeater, RepeaterSchema);
    question.discriminator(QuestionType.Block, BlockSchema);
}

/** These should be uniquely used **/
const ConstantSchema = new Schema({});

const CheckboxSchema = new Schema({
    strict: Boolean
});

const TextSchema = new Schema({
    minLength: Number,
    maxLength: Number
});

const LongTextSchema = new Schema({
    minLength: Number,
    maxLength: Number
});

const EmailSchema = new Schema({
    minLength: Number,
    maxLength: Number
});
const NumberSchema = new Schema({
    min: Number,
    max: Number
});
const RangeSchema = new Schema({
    min: Number,
    max: Number
});
const DateSchema = new Schema({
    min: { type: String, enum: [ 'TODAY' ] },
    max: { type: String, enum: [ 'TODAY' ] }
});

const SelectSchema = new Schema({
    option: { type: Schema.Types.ObjectId, ref: 'option', required: Boolean }
});
const SwitchSchema = new Schema({
    option: { type: Schema.Types.ObjectId, ref: 'option', required: Boolean }
});

const RadioSchema = new Schema({
    mode: { type: String, enum: [ 'BTN', 'RADIO' ], default: 'BTN' },
    option: { type: Schema.Types.ObjectId, ref: 'option', required: Boolean },
    inline: Boolean,
    strict: Boolean
});

/**
 * GROUPS
 */
const FormulaSchema = new Schema({
    fields: [ { type: Schema.Types.ObjectId, ref: model } ],
    rule: { type: String, required: true }
});

const RelationSchema = new Schema({
    fields: [ { type: Schema.Types.ObjectId, ref: model } ],
    rules: {}
});

const RepeaterSchema = new Schema({
    fields: [ { type: Schema.Types.ObjectId, ref: model } ],
    repeatLabel: String
});

const BlockSchema = new Schema({
    fields: [ { type: Schema.Types.ObjectId, ref: model } ]
});
