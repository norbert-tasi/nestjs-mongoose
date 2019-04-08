// const TSModuleAlias = require('@momothepug/tsmodule-alias');
// Makes it work with playAuto method
// this method Will scan backward until tsconfig is found
// const aliasRegister = TSModuleAlias.playAuto(__dirname);
/*/ www.js, index.js, main.js, etc
const TSModuleAlias = require('@momothepug/tsmodule-alias');
// Path from package.json to your tsconfig.json file
const tsconfigToReadFromRoot = './';
// Makes it work with play method
const aliasRegister = TSModuleAlias.play(tsconfigToReadFromRoot);
// Alias map loaded to nodejs from typescript paths (optional)
console.log(aliasRegister.nodeRegister.aliasMap);
// Displays root module and typescript project path (optional)
console.log(aliasRegister.currentEnvironmentData);
*/
import { NestFactory } from '@nestjs/core';
import * as e from 'express';
import * as session from 'express-session';
import { ApplicationModule } from './app.module';
import { Env } from './shared/env.util';
import { MyLoggerService } from './shared/mylogger.service';
const MongoStore = require('connect-mongo')(session);

declare const module: any;

console.log('Starting on PORT:' + process.env.PORT);

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    const express: any = e();

    // require('./config/index')(SERVER_CONFIG, express);
    const opts: any = {};
    if (Env('LOG_TO_FILE', false) === 'true' || Env('LOG_TO_DB', false) === 'true') {
        opts.logger = new MyLoggerService('Main');
    }
    const app = await NestFactory.create(ApplicationModule, express, opts);

    app.enableCors();
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { expires: new Date(253402300000000) },
            store: new MongoStore({
                url: process.env.MONGODB_SESSION_URI,
                autoRemove: 'native' // Default
            })
        })
    );
    // app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(PORT);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
