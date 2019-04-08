import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormSchema } from '@schema/form.schema';
import { ConfigModule } from '@src/config/config.module';
// app
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
    imports: [ ConfigModule, MongooseModule.forFeature([ { name: 'Form', schema: FormSchema } ]) ],
    controllers: [ FormController ],
    providers: [ FormService ]
})
export class FormModule {}
