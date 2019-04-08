import { Gender } from '@enum/gender.enum';
import { Roles } from '@enum/roles.enum';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { IUser } from '@model/sys/user';
import { Controller, ForbiddenException, Get, Post, Session, UseInterceptors } from '@nestjs/common';
import { readFileSync } from 'fs';
import { UserService } from '../sys/user/user.service';

interface addr {
    zip: string;
    town: string;
    str: string;
}

interface inst {
    web: string;
    email: string;
    address: addr;
    name: string;
}

@Controller('api/init')
@UseInterceptors(LoggingInterceptor)
export class InitController {
    constructor(private readonly service: UserService) {}

    @Get()
    async status(): Promise<any> {
        return Promise.resolve(Object.keys(Gender));
    }

    @Post()
    async init(@Session() session): Promise<IUser> {
        const user = session.user;
        if (!user) {
            const resp: IUser = {
                country: null,
                email: null,
                role: Roles.GUEST,
                lang: 'hu',
                name: null,
                status: null,
                username: 'Guest User',
                id: null
            };
            session.user = resp;
            return Promise.resolve(resp);
        }

        const usr: IUser = await this.service.findOne(user.username);
        // session.user = Object.assign({}, usr, { role: Roles.ASSISTANT });
        // usr.role = Roles.DOCTOR;
        if (!usr /*|| usr.status !== UserStatus.ACTIVE*/) {
            throw new ForbiddenException();
        }
        return Promise.resolve(usr);
    }

    @Get('cica')
    blabla() {
        const res = [];
        const str = readFileSync('inst.txt').toString();
        let start = 0;
        let end = 0;
        console.log('Enny: ' + str.length);
        while (start < str.length - 1) {
            const idx = str.indexOf('@', start);
            if (idx === -1) {
                break;
            }
            end = str.indexOf(' ', idx);
            if (end === -1) {
                end = str.length;
            }
            console.log(start + ' - ' + end);
            res.push(str.substring(start, end).trim());
            start = end + 1;
        }
        const response = [];
        res.forEach((inst: string) => {
            inst = inst.trim();
            if (!inst) {
                return;
            }
            response.push(this.cutter(inst));
        });
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
        console.log(subline);
        console.log(line);
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
    }
}
