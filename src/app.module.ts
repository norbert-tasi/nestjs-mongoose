import { InitController } from '@modules/public/init.controller';
import { LoginModule } from '@modules/public/login/login.module';
import { RegisterModule } from '@modules/public/register/register.module';
import { UserModule } from '@modules/sys/user/user.module';
import { MailerModule } from '@nest-modules/mailer';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { json, urlencoded } from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { FormModule } from './modules/study/form/form.module';
import { OptionModule } from './modules/study/option/option.module';
import { QuestionModule } from './modules/study/question/question.module';
import { StudyModule } from './modules/study/study.module';
import { CountryModule } from './modules/sys/country/country.module';
import { InstituteModule } from './modules/sys/institute/institute.module';
import { LanguageModule } from './modules/sys/language/language.module';
import { NewsModule } from './modules/sys/news/news.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ ConfigModule ],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URI')
            }),
            inject: [ ConfigService ]
        }),
        UserModule,
        LoginModule,
        CountryModule,
        InstituteModule,
        LanguageModule,
        NewsModule,
        FormModule,
        OptionModule,
        StudyModule,
        QuestionModule,
        RegisterModule,
        MailerModule.forRoot()
    ],
    controllers: [ InitController ]
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser(), helmet(), json(), urlencoded({ extended: true })).forRoutes('');
    }
}
