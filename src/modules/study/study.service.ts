import { ServiceBase } from '@common/ServiceBase';
// app
import { Study } from '@interfaces/study.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@src/config/config.service';
import { FormSchema } from '@src/schema/form.schema';
import { registerSchema } from '@src/schema/schema.base';
import { PaginateModel } from 'mongoose';

@Injectable()
export class StudyService extends ServiceBase<Study> {
    protected readonly path = '/api/study';

    constructor(protected config: ConfigService, @InjectModel('Study') protected readonly model: PaginateModel<Study>) {
        super(config, model);
        registerSchema('form', FormSchema);
    }

    async validate(data: Study): Promise<any> {
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

    separate(data: Study) {
        const { ...core } = data;
        return { core, lng: {} };
    }
    /*
    getDeep(id: string): Promise<Study> {
        return this.model.findById(id).populate({ path: 'visits.forms' }).exec();
    }*/
}
