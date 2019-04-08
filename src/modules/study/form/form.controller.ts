import { ControllerBase } from '@common/ControllerBase';
import { Roles } from '@decorators/roles.decorator';
import { Controller } from '@nestjs/common';
import { Form } from '@src/interfaces/form.interface';
import { FormService } from './form.service';

@Controller('api/form')
@Roles('ADMIN')
export class FormController extends ControllerBase<Form> {
    constructor(protected readonly service: FormService) {
        super(service);
    }
}
