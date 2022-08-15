import { WorkerTask } from './task';

export enum WorkerProcessorState {
  Idle,
  Busy,
}

export interface WorkerProcessor<D, R> {
  run(data: D): Promise<Awaited<R>>;
  terminate(): Promise<void>;
}

export interface WorkerProcessorFactory<D, R> {
  create(task: WorkerTask<D, R>): Promise<WorkerProcessor<D, R>>;
  destroy(processor: WorkerProcessor<D, R>): Promise<void>;
}
