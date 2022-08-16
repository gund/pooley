import { WorkerTask } from './task';

export interface WorkerProcessor<TData, TResult> {
  run(data: TData): Promise<Awaited<TResult>>;
  terminate(): Promise<void>;
}

export interface WorkerProcessorFactory<TData, TResult> {
  create(
    task: WorkerTask<TData, TResult>
  ): Promise<WorkerProcessor<TData, TResult>>;
  destroy(processor: WorkerProcessor<TData, TResult>): Promise<void>;
}

export enum WorkerProcessorState {
  Idle,
  Busy,
}
