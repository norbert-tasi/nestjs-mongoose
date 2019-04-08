import { ControllerBase } from '@common/ControllerBase';
import { Roles } from '@decorators/roles.decorator';
import { Controller } from '@nestjs/common';
import { Option } from '@src/interfaces/option.interface';
import { OptionService } from './option.service';

@Controller('api/option')
@Roles('ADMIN')
export class OptionController extends ControllerBase<Option> {
    constructor(protected readonly service: OptionService) {
        super(service);
    }
}
