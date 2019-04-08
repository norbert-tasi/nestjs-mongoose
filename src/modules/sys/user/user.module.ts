import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@schema/user.schema';
import { ConfigModule } from '@src/config/config.module';
// app
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [ ConfigModule, MongooseModule.forFeature([ { name: 'User', schema: UserSchema } ]) ],
    controllers: [ UserController ],
    providers: [ UserService ],
    exports: [ UserService ]
})
export class UserModule {}
