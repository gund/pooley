/* eslint-disable @typescript-eslint/no-empty-interface */

export interface WorkerPoolEmptyEvent {}

export interface WorkerPoolDrainEvent {
  idleProcessors: number;
}

export interface WorkerPoolBusyEvent {}

export interface WorkerPoolDataEvent<D> {
  data: D;
}

export interface WorkerPoolEvents<D> {
  empty: WorkerPoolEmptyEvent;
  drain: WorkerPoolDrainEvent;
  busy: WorkerPoolBusyEvent;
  data: WorkerPoolDataEvent<D>;
}
