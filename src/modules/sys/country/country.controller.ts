import { Roles } from '@decorators/roles.decorator';
import { Country } from '@interfaces/country.interface';
import { Controller } from '@nestjs/common';
import { ImportBase } from '@src/modules/common/ImportBase';
import { CountryService } from './country.service';

@Controller('api/country')
@Roles('ADMIN')
export class CountryController extends ImportBase<Country> {
    constructor(protected readonly service: CountryService) {
        super(service);
    }

    transformInput(lines: Array<any>) {
        lines = lines.map((l) => {
            if (!l.code || !l.name) {
                return { _res: 'invalid' };
            }
            return { code: l.code, callno: l.callno, active: l.active, lang: l.lang, name: l.name };
        });
        return lines;
    }
}
