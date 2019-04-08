import { Roles } from '@decorators/roles.decorator';
import { Institute } from '@interfaces/institute.interface';
import { Controller } from '@nestjs/common';
import { ImportBase } from '@src/modules/common/ImportBase';
import { InstituteService } from './institute.service';

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

@Controller('api/institute')
@Roles('ADMIN')
export class InstituteController extends ImportBase<Institute> {
    constructor(protected readonly service: InstituteService) {
        super(service);
    }

    transformInput(lines: Array<any>) {
        lines = lines.map((l) => {
            if (!l.name) {
                return { _res: 'invalid' };
            }
            return { name: l.name, code: l.code, email: l.email, webpage: webkitConvertPointFromPageToNode, users: [] };
        });
        return lines;
    }

    /*
    @Put(':id/users')
    userConnect(@Param('id') id: string, @Ctx() ctx: Context, @Body() data: Array<string>) {
        return this.service.connectUsers(id, data, ctx);
    }*/
}
