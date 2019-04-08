import {
    Body,
    FileInterceptor,
    InternalServerErrorException,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { Ctx } from '@src/decorators/ctx.decorator';
import { ModelDocument } from '@src/interfaces/Model.interface';
import { ControllerBase } from './ControllerBase';

export abstract class ImportBase<T extends ModelDocument> extends ControllerBase<T> {
    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file, @Body() data: any, @Ctx() ctx) {
        let res = [];
        let s = file.buffer.toString('utf8').split('\n');
        s.forEach((l) => {
            if (!l.trim()) {
                return;
            }
            res.push(JSON.parse(l));
        });
        res = this.transformInput(res);
        const fails = res.filter((r) => r._res === 'invalid');
        const valid = res.filter((r) => r._res !== 'invalid');
        if (!data.lang) {
            throw new InternalServerErrorException('LANG');
        }
        if (!valid.length) {
            throw new InternalServerErrorException('NO');
        }
        res.forEach((r) => this.service.import(r, data.lang, ctx));
        // parse(s, { encoding: 'utf8', complete: (result) => (res = result) });
        return { fails, valid };
    }

    abstract transformInput(lines: Array<any>);
}
