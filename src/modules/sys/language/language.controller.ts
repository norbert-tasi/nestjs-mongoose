import { Roles } from '@decorators/roles.decorator';
import { Language } from '@interfaces/language.interface';
import { Controller } from '@nestjs/common';
import { ImportBase } from '@src/modules/common/ImportBase';
import { LanguageService } from './language.service';

@Controller('api/language')
@Roles('ADMIN')
export class LanguageController extends ImportBase<Language> {
    constructor(protected readonly service: LanguageService) {
        super(service);
    }

    transformInput(lines: any[]) {
        lines = lines.map((l) => {
            if (!l.code || !l.name) {
                return { _res: 'invalid' };
            }
            return { code: l.code, active: l.active, name: l.name };
        });
        return lines;
    }
}
