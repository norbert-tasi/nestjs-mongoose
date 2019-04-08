import { ControllerBase } from '@common/ControllerBase';
import { Roles } from '@decorators/roles.decorator';
import { Question } from '@interfaces/question.interface';
import { Controller } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('api/question')
@Roles('ADMIN')
export class QuestionController extends ControllerBase<Question> {
    constructor(protected readonly service: QuestionService) {
        super(service);
    }
}
