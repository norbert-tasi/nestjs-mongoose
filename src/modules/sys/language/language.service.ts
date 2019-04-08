import { ServiceBase } from '@common/ServiceBase';
// app
import { Language } from '@interfaces/language.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@src/config/config.service';
import { PaginateModel } from 'mongoose';

@Injectable()
export class LanguageService extends ServiceBase<Language> {
    protected readonly path = '/api/language';

    constructor(
        protected config: ConfigService,
        @InjectModel('Language') protected readonly model: PaginateModel<Language>
    ) {
        super(config, model);
    }

    async validate(data: Language): Promise<any> {
        if (!data.name) {
            throw new InternalServerErrorException('name');
        }
        if (!data.code) {
            throw new InternalServerErrorException('code');
        }
        if (!data.id) {
            /*const queryByCode = await this.findOne({ code: data.code });
            if (queryByCode) {
                throw new InternalServerErrorException('CODE');
            }*/
        }
    }

    separate(data: Language) {
        const { name, ...core } = data;
        return { core, lng: { name } };
    }
}
