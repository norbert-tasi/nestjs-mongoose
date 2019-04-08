import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionSchema } from '@schema/question.schema';
import { ConfigModule } from '@src/config/config.module';
// app
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
    imports: [ ConfigModule, MongooseModule.forFeature([ { name: 'Question', schema: QuestionSchema } ]) ],
    controllers: [ QuestionController ],
    providers: [ QuestionService ]
})
export class QuestionModule {}
