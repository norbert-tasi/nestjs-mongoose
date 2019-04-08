import { ServiceBase } from '@common/ServiceBase';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@src/config/config.service';
// app
import { Option } from '@src/interfaces/option.interface';
import { PaginateModel } from 'mongoose';

@Injectable()
export class OptionService extends ServiceBase<Option> {
    protected readonly path = '/api/option';

    constructor(
        protected config: ConfigService,
        @InjectModel('Option') protected readonly model: PaginateModel<Option>
    ) {
        super(config, model);
    }

    async validate(data: Option): Promise<any> {
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

    separate(data: Option) {
        const { ...core } = data;
        return { core, lng: {} };
    }
}
