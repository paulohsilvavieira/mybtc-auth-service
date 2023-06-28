import { INestApplication, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { json } from 'express';

export class TracerContext extends AsyncLocalStorage<string> {}
export const tracerContext = new TracerContext();

type EventMessage = {
  attributes?: Record<string, string>;
  data?: string;
  messageId: string;
};

type Event = {
  message: EventMessage;
  subscription: string;
};

type RequestHeaders = Record<string, string>;

const getTraceIdFromEvent = (event: Event) =>
  event?.message?.attributes?.traceId;

const getTraceIdFromRequest = (headers: RequestHeaders) =>
  headers['x-trace-id'];

const getTraceIdFromRequestOrEvent = (req: Record<string, unknown>): string => {
  const event = req.body as Event;
  const isEvent = Boolean(event.subscription && event.message?.messageId);

  const traceId = isEvent
    ? getTraceIdFromEvent(event)
    : getTraceIdFromRequest((req.headers || {}) as RequestHeaders);

  return traceId || randomUUID();
};

const trace = (
  req: Record<string, unknown>,
  _res: Record<string, unknown>,
  next: () => void,
) => {
  tracerContext.run(getTraceIdFromRequestOrEvent(req), next);
};

export const getTraceId = () => tracerContext.getStore();

export const configureTracing = (app: INestApplication) => {
  app.use(json());
  app.use(trace);
  Logger.log('Tracing initialized', 'Configuration');
  return app;
};
