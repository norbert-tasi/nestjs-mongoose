import { Roles } from '@decorators/roles.decorator';
import { News } from '@interfaces/news.interface';
import { Controller } from '@nestjs/common';
import { ControllerBase } from '@src/modules/common/ControllerBase';
import { NewsService } from './news.service';

@Controller('api/news')
@Roles('ADMIN')
export class NewsController extends ControllerBase<News> {
    constructor(protected readonly service: NewsService) {
        super(service);
    }
}
