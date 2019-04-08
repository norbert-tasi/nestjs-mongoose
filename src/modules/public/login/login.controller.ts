import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { ICredentials, IUser } from '@model/sys/user';
import { UserService } from '@modules/sys/user/user.service';
import { Body, Controller, Get, Inject, Post, Query, Session, UseInterceptors } from '@nestjs/common';

@Controller('api/login')
@UseInterceptors(LoggingInterceptor)
export class LoginController {
    constructor(private readonly service: UserService, @Inject('MailerProvider') private readonly mailerProvider) {}

    @Post()
    async login(@Body() data: ICredentials, @Session() session): Promise<IUser> {
        const user: IUser = await this.service.findValidOne(data);
        if (data.rememberme) {
            session.cookie.maxAge = 2628000000;
        } else {
            session.cookie.maxAge = null;
        }

        const resp: IUser = {
            country: user.country,
            email: user.email,
            lang: user.lang,
            name: user.name,
            role: user.role,
            status: user.status,
            username: user.username,
            id: user.id
        };
        session.user = resp;

        return Promise.resolve(resp);
    }

    @Get('reminder')
    async reminder(@Query('name') data) {
        return this.mailerProvider.sendMail({
            to: 'tasinorbert78@gmail.com',
            from: 'tasinorbert78@gmail.com',
            subject: 'Testing nodejs email sending',
            text: 'Hey there ' + data,
            html: '<b>hi!</b>' + data
        });
    }
}
