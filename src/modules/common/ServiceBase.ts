import { Context } from '@decorators/ctx.decorator';
import { ModelDocument } from '@interfaces/Model.interface';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@src/config/config.service';
import { MyLoggerService } from '@src/shared/mylogger.service';
import { PaginateModel, PaginateResult } from 'mongoose';

export abstract class ServiceBase<T extends ModelDocument> {
    protected readonly logger: MyLoggerService = new MyLoggerService(this.constructor.name);
    protected abstract readonly path: string;

    constructor(protected config: ConfigService, protected readonly model: PaginateModel<T>) {}

    async create(data: T, ctx: Context): Promise<T> {
        this.logger.log('Create ' + JSON.stringify(data));
        await this.validate(data);
        const { lng, core } = this.separate(data);
        const head = await this.model.create(core);
        Object.assign(head, lng);
        const { lang, user, role } = ctx;
        data.createdBy = user;
        data.updatedBy = user;
        try {
            const server = this.config.getServer(ctx.lang, 'post', `${this.path}`, { lang, user, role }, null, head);
            const resp = await server;
            return resp.data;
        } catch (err) {
            // in case of any error the head record should be removed. must be fixed somehow. does not clear the historical records.
            this.logger.error(err);
            // head.historicalClear(function(e, obj) {});
            // head.remove();
            throw new InternalServerErrorException(err.response.data);
        }
    }

    async import(data: T, lang: string, ctx: Context): Promise<T> {
        await this.validate(data);
        const { lng, core } = this.separate(data);
        const catalog = new this.model(core);
        const head = await catalog.save();
        Object.assign(head, lng);
        const { user, role } = ctx;
        data.createdBy = user;
        data.updatedBy = user;
        try {
            const server = this.config.getServer(lang, 'post', `${this.path}`, { user, role }, null, head);
            const resp = await server;
            return resp.data;
        } catch (err) {
            // in case of any error the head record should be removed. must be fixed somehow. does not clear the historical records.
            head.historicalClear(function(e, obj) {});
            head.remove();
            throw new InternalServerErrorException(err.response.data);
        }
    }

    abstract async validate(data: T): Promise<any>;

    abstract separate(data: T);

    async update(id: string, data: T, ctx: Context): Promise<T> {
        try {
            this.logger.log('Update ' + JSON.stringify(data));
            await this.validate(data);
            const curr = await this.model.findById(id).exec();
            const { lng, core } = this.separate(data);
            Object.assign(curr, core);
            await curr.save();
            Object.assign(core, lng);
            const server = this.config.getServer(ctx.lang, 'put', `${this.path}/${id}`, ctx, null, core);
            const resp = await server;
            return resp.data;
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    async get(id: string, ctx: Context): Promise<T> {
        try {
            const server = this.config.getServer(ctx.lang, 'get', `${this.path}/${id}`, ctx);
            const resp = await server;
            this.logger.log(resp.data);
            return resp.data;
        } catch (err) {
            throw new InternalServerErrorException(err.data);
        }
    }

    async delete(id: string, ctx: Context): Promise<T> {
        try {
            this.logger.log('DELETE ' + JSON.stringify({ id, ...ctx }));
            await this.config.getServer(ctx.lang, 'delete', `${this.path}/${id}`, ctx);
            return this.model.findById(id).remove().exec();
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    async getDeep(id: string, ctx: Context): Promise<T> {
        try {
            const server = this.config.getServer(ctx.lang, 'get', `${this.path}/${id}/deep`, ctx);
            const resp = await server;
            return resp.data;
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException(err);
        }
    }

    findOne(query: string): Promise<T> {
        return this.model.findOne(query, { _class: 0 }).exec();
    }

    async findAll(ctx: Context): Promise<T[]> {
        try {
            const server = this.config.getServer(ctx.lang, 'get', `${this.path}`, ctx);
            const resp = await server;
            return resp.data;
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    async find(filter: string | RegExp, page: number, rows: number, ctx: Context): Promise<PaginateResult<T>> {
        try {
            const server = this.config.getServer(ctx.lang, 'get', `${this.path}`, ctx, { filter, page, rows });
            const resp = await server;
            return resp.data;
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
}
