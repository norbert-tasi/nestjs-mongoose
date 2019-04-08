import { User } from '@interfaces/user.interface';
import { Controller } from '@nestjs/common';
import { ImportBase } from '@src/modules/common/ImportBase';
import { Roles } from 'dist/server/src/decorators/roles.decorator';
import { UserService } from './user.service';

@Controller('api/user')
@Roles('ADMIN')
export class UserController extends ImportBase<User> {
    constructor(protected readonly service: UserService) {
        super(service);
    }

    transformInput(lines: Array<any>) {
        lines = lines.map((l) => {
            if (!l.username || !l.name) {
                return { _res: 'invalid' };
            }
            return { username: l.username, lang: l.lang, name: l.name };
        });
        return lines;
    }
    /*
    @Get('load')
    load(@Ctx() ctx: Context) {
        const str = readFileSync('huprof.txt').toString();
        const res = str.split('\n');
        const ressplit = res.map((doc) => doc.split('"'));

        const response = [];
        ressplit.forEach((doc: string[]) => {
            if (!doc || !doc.length || !doc[1] || !doc[1].trim()) {
                return;
            }
            response.push({
                email: doc[1] + '@notknown.hu',
                role: doc[9] === 'DOC' ? Roles.DOCTOR : Roles.ASSISTANT,
                name: doc[5],
                username: doc[1]
            });
        });
        ctx.lang = 'hu';
        ctx.role = 'ADMIN';
        ctx.user = 'admin';
        response.forEach((d) => this.service.create(d));
        return Promise.resolve(response);
    }

    private cutter(line: string) {
        line = line.trim();
        if (!line) {
            return null;
        }
        let www = line.indexOf('www');
        if (www === -1) {
            www = line.indexOf('http');
        }
        if (www === -1) {
            www = line.lastIndexOf(' ');
        }
        const subline = line.substring(0, www);
        const nums = subline.match(/\d+/g);
        const words = subline.split(' ');
        const zip = words.findIndex((w) => w === nums[0]);
        const name = words.slice(0, zip).join(' ').trim();
        const endweb = line.indexOf(' ', www);
        const address = subline.substr(subline.indexOf(words[zip])).trim();
        const firstspace = address.indexOf(' ');
        const colon = address.indexOf(',', firstspace);
        const resp: inst = {
            name,
            web: line.substring(www, endweb).trim(),
            email: line.substr(line.lastIndexOf(' ') + 1).trim(),
            address: {
                zip: address.substring(0, firstspace).trim(),
                town: address.substring(firstspace, colon).trim(),
                str: address.substr(colon + 1).trim()
            }
        };
        return resp;
    }*/
}
