import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

const env = process.env.NODE_ENV || '';

@Module({
    imports: [ HttpModule ],
    providers: [ ConfigService ],
    exports: [ ConfigService ]
})
export class ConfigModule {}
