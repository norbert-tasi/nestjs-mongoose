import { ServiceBase } from '@common/ServiceBase';
// app
import { News } from '@interfaces/news.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@src/config/config.service';
import { PaginateModel } from 'mongoose';

@Injectable()
export class NewsService extends ServiceBase<News> {
    protected readonly path = '/api/news';

    constructor(protected config: ConfigService, @InjectModel('News') protected readonly model: PaginateModel<News>) {
        super(config, model);
    }

    async validate(data: News) {
        if (!data.text) {
            throw new InternalServerErrorException('text');
        }
    }

    separate(data: News) {
        const { text, ...core } = data;
        return { core, lng: { text } };
    }
}
