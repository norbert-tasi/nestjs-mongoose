import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { IRegister, IUser } from '@model/sys/user';
import { UserService } from '@modules/sys/user/user.service';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

@Controller('api/register')
@UseInterceptors(LoggingInterceptor)
export class RegisterController {
    constructor(private readonly service: UserService) {}

    @Post()
    async register(@Body() data: IRegister) {
        const user = await this.service.register(data);
        const { country, email, lang, name, role, status, username, id } = user;
        const resp: IUser = {
            country,
            email,
            lang,
            name,
            role,
            status,
            username,
            id
        };
        return Promise.resolve(resp);
    }
}
