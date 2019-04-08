import { UserModule } from '@modules/sys/user/user.module';
import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';

@Module({
    imports: [ UserModule ],
    controllers: [ LoginController ]
})
export class LoginModule {}
