import { ServiceBase } from '@common/ServiceBase';
import { User } from '@interfaces/user.interface';
import { ICredentials, IPwdChange, IRegister, IUser } from '@model/sys/user';
import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@src/config/config.service';
import { Context } from '@src/decorators/ctx.decorator';
import { PaginateModel, PaginateResult } from 'mongoose';

@Injectable()
export class UserService extends ServiceBase<User> {
    protected readonly path: string;

    constructor(protected config: ConfigService, @InjectModel('User') protected readonly model: PaginateModel<User>) {
        super(config, model);
    }

    async validate(data: User): Promise<any> {
        /*if (!data.text) {
            throw new InternalServerErrorException('text');
        }
        if (!data.code) {
            throw new InternalServerErrorException('code');
        }
        if (!data.id) {
            const queryByCode = await this.findOne({ code: data.code });
            if (queryByCode) {
                throw new InternalServerErrorException('CODE');
            }
        }*/
    }

    separate(data: User) {
        const { ...core } = data;
        return { core, lng: {} };
    }

    async register(usr: IRegister): Promise<User> {
        const queryEmail = await this.getOne({ email: usr.email });
        if (queryEmail) {
            throw new InternalServerErrorException('EMAIL');
        }
        if (!usr.password) {
            throw new InternalServerErrorException('Missing Fields');
        }

        if (usr.password !== usr.passwordConfirm) {
            throw new InternalServerErrorException('Password Mismatch');
        }
        const catalog = new this.model(usr);
        return catalog.save();
    }

    async create(usr: User): Promise<User> {
        const queryEmail = await this.getOne({ email: usr.email });
        if (queryEmail) {
            throw new InternalServerErrorException('EMAIL');
        }
        usr.password = 'n/a';
        const catalog = new this.model(usr);
        return catalog.save();
    }

    async update(id: string, data: IUser) {
        const usr = await this.get(id);
        if (!usr) {
            throw new InternalServerErrorException('NOUSER');
        }
        if (usr.username !== data.username) {
            throw new InternalServerErrorException('USERNAME');
        }
        Object.assign(usr, data);
        return usr.save();
    }

    async updatePassword(id: string, data: IPwdChange) {
        const usr = await this.get(id);
        if (!usr) {
            throw new InternalServerErrorException('NOUSER');
        }
        usr.schema.methods.comparePassword(usr.password, data.oldPassword, (isMatch) => {
            if (!isMatch) {
                console.log('Old password is invalid ');
                throw new ForbiddenException();
            }
        });

        if (!data.password || !data.passwordConfirm) {
            throw new InternalServerErrorException('Missing Fields');
        }
        if (data.password !== data.passwordConfirm) {
            throw new InternalServerErrorException('PASSWORD_MISMATCH');
        }

        Object.assign(usr, data);
        return usr.save();
    }

    findAll(): Promise<User[]> {
        return this.model.find().exec();
    }

    find(filter: string, page: number, rows: number, ctx: Context): Promise<PaginateResult<User>> {
        const filterRegex = filter && RegExp('^' + filter.toLowerCase(), 'i');
        const q = filter ? { $or: [ { username: filterRegex }, { name: filterRegex } ] } : {};
        return this.model.paginate(q, {
            page: +page,
            limit: +rows
        });
    }

    get(id: string): Promise<User> {
        return this.model.findById(id).exec();
    }

    findOne(username: string): Promise<User> {
        return this.model.findOne({ username }, { _class: 0, password: 0 }).exec();
    }

    async findValidOne(user: ICredentials): Promise<IUser> {
        const data = await this.model.findOne({ username: user.username }, { _class: 0 }).exec();
        if (!data) {
            console.log('Attempt failed to login with ' + user.username);
            throw new ForbiddenException();
        }

        data.schema.methods.comparePassword(data.password, user.password, (isMatch) => {
            if (!isMatch) {
                console.log('Attempt failed to login with ' + data.username);
                throw new ForbiddenException();
            }
        });

        data.password = null;

        return data;
    }

    getOne(query: object): Promise<User> {
        return this.model.findOne(query, { _class: 0, password: 0 }).exec();
    }
}
