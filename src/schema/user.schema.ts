import { Roles } from '@enum/roles.enum';
import { UserStatus } from '@enum/user-status.enum';
import * as crypto from 'crypto';
import { Schema } from 'mongoose';
import { initSchema } from './schema.base';

const model = 'user';

export const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
    role: { type: String, enum: Object.keys(Roles), required: true, default: Roles.DOCTOR },
    email: { type: String, required: true, unique: true },
    lang: { type: String, required: false, default: 'hu' },
    status: { type: String, enum: Object.keys(UserStatus), required: true, default: UserStatus.REG },
    country: { type: String, required: false }
});

UserSchema.index({ code: 1 });
initSchema(UserSchema, model);

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    // tslint:disable-next-line:no-string-literal
    this['password'] = crypto.createHash('sha256').update(this['password']).digest('hex');
    next();
});

// Password verification
// tslint:disable-next-line:only-arrow-functions
UserSchema.methods.comparePassword = function(current, password, cb) {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    cb(hash === current);
};
