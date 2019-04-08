import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };
    private servers: Object = {};

    constructor(private httpService: HttpService) {
        this.envConfig = {
            PORT: process.env.PORT,
            MONGODB_URI: process.env.MONGODB_URI,
            MONGODB_SESSION_URI: process.env.MONGODB_SESSION_URI,
            SESSION_SECRET: process.env.SESSION_SECRET
        };

        const externals = JSON.parse(process.env.EXTERNALS);
        for (const lang in externals) {
            this.servers[lang] = externals[lang];
        }
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    getServer(lang: string, method: string, url: string, headers: Object, params?: Object, data?: Object) {
        const config = { baseURL: this.servers[lang], url, headers, method, data, params };
        return this.httpService.request(config).toPromise();
    }
}
