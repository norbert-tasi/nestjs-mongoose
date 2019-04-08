import { ServiceBase } from '@common/ServiceBase';
// app
import { Question } from '@interfaces/question.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@src/config/config.service';
import { questionDiscriminators } from '@src/schema/question.schema';
import { PaginateModel } from 'mongoose';

@Injectable()
export class QuestionService extends ServiceBase<Question> {
    protected readonly path = '/api/question';

    constructor(
        protected config: ConfigService,
        @InjectModel('Question') protected readonly model: PaginateModel<Question>
    ) {
        super(config, model);
        questionDiscriminators(this.model);
    }

    async validate(data: Question): Promise<any> {
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

    separate(data: Question) {
        console.log(data);
        const { ...core } = data;
        return { core, lng: {} };
    }
}
