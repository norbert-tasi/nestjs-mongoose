import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSchema } from '@schema/news.schema';
import { ConfigModule } from '@src/config/config.module';
// app
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
    imports: [ ConfigModule, MongooseModule.forFeature([ { name: 'News', schema: NewsSchema } ]) ],
    controllers: [ NewsController ],
    providers: [ NewsService ]
})
export class NewsModule {}
