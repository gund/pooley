/* eslint-disable @typescript-eslint/no-empty-interface */

export enum WorkerPoolEvent {
  Empty = 'empty',
  Drain = 'drain',
  Busy = 'busy',
  Data = 'data',
}

export interface WorkerPoolEvents<D> {
  [WorkerPoolEvent.Empty]: WorkerPoolEmptyEvent;
  [WorkerPoolEvent.Drain]: WorkerPoolDrainEvent;
  [WorkerPoolEvent.Busy]: WorkerPoolBusyEvent;
  [WorkerPoolEvent.Data]: WorkerPoolDataEvent<D>;
}

export interface WorkerPoolEmptyEvent {}

export interface WorkerPoolDrainEvent {
  idleProcessors: number;
}

export interface WorkerPoolBusyEvent {}

export interface WorkerPoolDataEvent<D> {
  data: Awaited<D>;
}
