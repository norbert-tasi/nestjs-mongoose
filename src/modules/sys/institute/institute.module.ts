import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstituteSchema } from '@schema/institute.schema';
import { ConfigModule } from '@src/config/config.module';
// app
import { InstituteController } from './institute.controller';
import { InstituteService } from './institute.service';

@Module({
    imports: [ ConfigModule, MongooseModule.forFeature([ { name: 'Institute', schema: InstituteSchema } ]) ],
    controllers: [ InstituteController ],
    providers: [ InstituteService ]
})
export class InstituteModule {}
