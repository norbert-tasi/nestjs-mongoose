import { Roles } from '@decorators/roles.decorator';
import { Study } from '@interfaces/study.interface';
import { Controller } from '@nestjs/common';
import { ControllerBase } from '@src/modules/common/ControllerBase';
import { StudyService } from './study.service';

@Controller('api/study')
@Roles('ADMIN')
export class StudyController extends ControllerBase<Study> {
    constructor(protected readonly service: StudyService) {
        super(service);
    }
}
