import { model, Schema } from 'mongoose';
import * as paginate from 'mongoose-paginate';
import { history } from './history-plugin';

export function initPlugin(schema: Schema, options: { name: string }) {
    schema.add({ createdBy: String, updateBy: String });
    schema.set('toJSON', { virtuals: true });
    schema.set('timestamps', true);
    schema.set('collection', options.name);
    schema.plugin(history, options);
    schema.plugin(paginate);
}

export function initSchema(schema: Schema, name: string) {
    console.log('init schema:' + name);
    schema.plugin(initPlugin, { name });
}

export function registerSchema(name, schema) {
    console.log('register schema:' + name);
    return model(name, schema);
}
