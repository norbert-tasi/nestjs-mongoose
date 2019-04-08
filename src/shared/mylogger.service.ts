import { LoggerService } from '@nestjs/common';
import * as chalk from 'chalk';
import * as PrettyError from 'pretty-error'; // it's really handy to make your life easier
import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import 'winston-mongodb';
import { Env } from './env.util'; // using typescript paths, you know !

export class MyLoggerService implements LoggerService {
    private readonly logger: Logger;
    private readonly prettyError = new PrettyError();

    constructor(private context: string, transport?) {
        const logTransportList = [];
        logTransportList.push(new transports.Console());
        if (Env('LOG_TO_FILE', false) === 'true') {
            logTransportList.push(
                new transports.File({
                    filename: Env('LOG_FILE', 'app.dev.log'),
                    format: format.json(),
                    options: { timestamp: true, prettyPrint: true }
                })
            );
        }
        if (Env('LOG_TO_DB', false) === 'true') {
            logTransportList.push(
                new transports['MongoDB']({
                    db: process.env.MONGODB_LOG_URI,
                    handleExceptions: true,
                    storeHost: true
                })
            );
        }
        this.logger = createLogger();
        this.logger.configure({
            level: 'info',
            transports: logTransportList,
            exitOnError: false
        });
        this.prettyError.skipNodeFiles();
        this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
    }

    log(message: string): void {
        const currentDate = new Date();
        this.logger.info(message, {
            timestamp: currentDate.toISOString(),
            context: this.context
        });
        this.formatedLog('info', message);
    }
    error(message: string, trace?: any): void {
        const currentDate = new Date();
        // i think the trace should be JSON Stringified
        this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
            timestamp: currentDate.toISOString(),
            context: this.context
        });
        this.formatedLog('error', message, trace);
    }
    warn(message: string): void {
        const currentDate = new Date();
        this.logger.warn(message, {
            timestamp: currentDate.toISOString(),
            context: this.context
        });
        this.formatedLog('warn', message);
    }
    overrideOptions(options: LoggerOptions) {
        this.logger.configure(options);
    }
    // this method just for printing a cool log in your terminal , using chalk
    private formatedLog(level: string, message: string, error?): void {
        let result = '';
        const color = chalk.default;
        const currentDate = new Date();
        const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        switch (level) {
            case 'info':
                result = `[${color.blue('INFO')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
                    this.context
                )}] ${message}`;
                break;
            case 'error':
                result = `[${color.red('ERR')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
                    this.context
                )}] ${message}`;
                if (error && Env('NODE_ENV') === 'dev') this.prettyError.render(error, true);
                break;
            case 'warn':
                result = `[${color.yellow('WARN')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
                    this.context
                )}] ${message}`;
                break;
            default:
                break;
        }
        console.log(result);
    }
}
