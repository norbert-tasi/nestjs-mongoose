import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudySchema } from '@schema/study.schema';
import { ConfigModule } from '@src/config/config.module';
// app
import { StudyController } from './study.controller';
import { StudyService } from './study.service';

@Module({
    imports: [ ConfigModule, MongooseModule.forFeature([ { name: 'Study', schema: StudySchema } ]) ],
    controllers: [ StudyController ],
    providers: [ StudyService ]
})
export class StudyModule {}
