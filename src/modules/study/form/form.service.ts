import { ServiceBase } from '@common/ServiceBase';
// app
import { Form } from '@interfaces/form.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@src/config/config.service';
import { QuestionSchema } from '@src/schema/question.schema';
import { registerSchema } from '@src/schema/schema.base';
import { PaginateModel } from 'mongoose';

@Injectable()
export class FormService extends ServiceBase<Form> {
    protected readonly path = '/api/form';

    constructor(protected config: ConfigService, @InjectModel('Form') protected readonly model: PaginateModel<Form>) {
        super(config, model);
        registerSchema('question', QuestionSchema);
    }

    async validate(data: Form): Promise<any> {
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

    separate(data: Form) {
        const { ...core } = data;
        return { core, lng: {} };
    }
}
