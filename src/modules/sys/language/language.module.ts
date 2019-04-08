import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageSchema } from '@schema/language.schema';
import { ConfigModule } from '@src/config/config.module';
// app
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';

@Module({
    imports: [ ConfigModule, MongooseModule.forFeature([ { name: 'Language', schema: LanguageSchema } ]) ],
    controllers: [ LanguageController ],
    providers: [ LanguageService ]
})
export class LanguageModule {}
