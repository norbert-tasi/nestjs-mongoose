import { IUser } from '@model/sys/user';
import { ModelDocument } from './Model.interface';

export interface User extends ModelDocument, IUser {
    password: string;
}
