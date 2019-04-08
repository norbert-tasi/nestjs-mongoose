import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountrySchema } from '@schema/country.schema';
import { ConfigModule } from '@src/config/config.module';
// app
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
    imports: [ ConfigModule, MongooseModule.forFeature([ { name: 'Country', schema: CountrySchema } ]) ],
    controllers: [ CountryController ],
    providers: [ CountryService ]
})
export class CountryModule {}
