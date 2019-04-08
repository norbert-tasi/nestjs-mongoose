import { Context, Ctx } from '@decorators/ctx.decorator';
import { RolesGuard } from '@guards/roles.guard';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { ModelDocument } from '@interfaces/Model.interface';
import { Body, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ServiceBase } from './ServiceBase';

@UseInterceptors(LoggingInterceptor)
@UseGuards(RolesGuard)
export abstract class ControllerBase<T extends ModelDocument> {
    constructor(protected readonly service: ServiceBase<T>) {}

    @Post()
    create(@Ctx() ctx: Context, @Body() data: T) {
        data.updatedBy = ctx.user;
        return this.service.create(data, ctx);
    }

    @Put(':id')
    update(@Param('id') id: string, @Ctx() ctx: Context, @Body() data: T) {
        data.updatedBy = ctx.user;
        return this.service.update(id, data, ctx);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Ctx() ctx: Context) {
        return this.service.delete(id, ctx);
    }

    @Get()
    findAll(
        @Ctx() ctx: any,
        @Query('filter') filter: string,
        @Query('page') page: number,
        @Query('rows') rows: number
    ): Promise<any> {
        return this.service.find(filter, page, rows, ctx);
    }

    @Get(':id')
    get(@Param('id') id: string, @Ctx() ctx: Context): Promise<T> {
        return this.service.get(id, ctx);
    }

    @Get(':id/deep')
    getDeep(@Param('id') id: string, @Ctx() ctx: Context): Promise<T> {
        return this.service.getDeep(id, ctx);
    }
}
