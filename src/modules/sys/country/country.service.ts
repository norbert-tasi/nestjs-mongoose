import { ServiceBase } from '@common/ServiceBase';
// app
import { Country } from '@interfaces/country.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@src/config/config.service';
import { PaginateModel } from 'mongoose';

@Injectable()
export class CountryService extends ServiceBase<Country> {
    protected readonly path = '/api/country';

    constructor(
        protected config: ConfigService,
        @InjectModel('Country') protected readonly model: PaginateModel<Country>
    ) {
        super(config, model);
    }

    async validate(data: Country): Promise<any> {
        if (!data.name) {
            throw new InternalServerErrorException('name');
        }
        if (!data.code) {
            throw new InternalServerErrorException('code');
        }
        if (!data._id) {
            /* const queryByCode = await this.findOne({ code: data.code });
            if (queryByCode) {
                throw new InternalServerErrorException('CODE');
            }*/
        }
        Promise.resolve(true);
    }

    separate(data: Country) {
        const { name, ...core } = data;
        return { core, lng: { name } };
    }
}
