import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@src/config/config.module';
import { OptionSchema } from '@src/schema/option.schema';
// app
import { OptionController } from './option.controller';
import { OptionService } from './option.service';

@Module({
    imports: [ ConfigModule, MongooseModule.forFeature([ { name: 'Option', schema: OptionSchema } ]) ],
    controllers: [ OptionController ],
    providers: [ OptionService ]
})
export class OptionModule {}
