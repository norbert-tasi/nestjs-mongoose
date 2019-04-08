import { ServiceBase } from '@common/ServiceBase';
// app
import { Institute } from '@interfaces/institute.interface';
import { IInstitute } from '@model/sys/institute';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@src/config/config.service';
import { Context } from '@src/decorators/ctx.decorator';
import { registerSchema } from '@src/schema/schema.base';
import { UserSchema } from '@src/schema/user.schema';
import { PaginateModel } from 'mongoose';

@Injectable()
export class InstituteService extends ServiceBase<Institute> {
    protected readonly path = '/api/institute';

    constructor(
        protected config: ConfigService,
        @InjectModel('Institute') protected readonly model: PaginateModel<Institute>
    ) {
        super(config, model);
        registerSchema('user', UserSchema);
    }
    /*
    async connectUsers(id: string, data: Array<string>, ctx: Context) {
        const curr = await this.model.findById(id).exec();
        curr.updatedBy = ctx.user;
        curr.users = data;
        return curr.save();
    }*/

    async validate(data: Institute): Promise<any> {
        /* if (!data.text) {
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

    get(id: string): Promise<Institute> {
        return this.model.findById(id).populate('users').exec();
    }

    separate(data: Institute) {
        const { ...core } = data;
        return { core, lng: {} };
    }

    async create(data: Institute): Promise<Institute> {
        /*const queryEmail = await this.getOne({ email: data.email });
        if (queryEmail) {
            throw new InternalServerErrorException('EMAIL');
        }*/
        const catalog = new this.model(data);
        return catalog.save();
    }

    async update(id: string, data: IInstitute) {
        const orig = await this.get(id);
        if (!orig) {
            throw new InternalServerErrorException('NOINST');
        }
        /*if (usr.username !== data.username) {
            throw new InternalServerErrorException('USERNAME');
        }*/
        Object.assign(orig, data);
        return orig.save();
    }

    delete(id: string, ctx: Context): Promise<Institute> {
        this.logger.log('DELETE ' + JSON.stringify({ id, ...ctx }));
        return this.model.findById(id).remove().exec();
    }

    findAll(): Promise<Institute[]> {
        return this.model.find().exec();
    }
}
