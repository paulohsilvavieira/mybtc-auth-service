import {
  WinstonModuleOptions,
  utilities as nestWinstonUtils,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { getTraceId } from './trace.config';

const { Console } = winston.transports;
const { combine, timestamp, json } = winston.format;
const { nestLike } = nestWinstonUtils.format;

const levels: object = {
  default: 'DEFAULT',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
};

const trace = winston.format((info) => {
  return Object.assign({}, info, { traceId: getTraceId() });
});

const severity = winston.format((info) => {
  const { level } = info;
  return Object.assign({}, info, { severity: levels[level] });
});

const remoteFormat = () => combine(severity(), trace(), json());
const localFormat = () => combine(timestamp(), severity(), trace(), nestLike());

export const createNestLogger = () => {
  const isLocal = process.env.NODE_ENV === 'development';
  const silent = Boolean(process.env.CI) || process.env.NODE_ENV === 'test';
  const loggerConfig: WinstonModuleOptions = {
    levels: winston.config.npm.levels,
    level: process.env.LOG_LEVEL || 'info',
    format: isLocal ? localFormat() : remoteFormat(),
    transports: [new Console()],
    silent,
  };

  return WinstonModule.createLogger(loggerConfig);
};
