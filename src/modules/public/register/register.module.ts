import { UserModule } from '@modules/sys/user/user.module';
import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';

@Module({
    imports: [ UserModule ],
    controllers: [ RegisterController ]
})
export class RegisterModule {}
