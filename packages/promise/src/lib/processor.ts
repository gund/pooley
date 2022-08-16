import { WorkerProcessor, WorkerTask } from '@pooley/core';

/**
 * Allows to execute tasks in a pool using Promises to wait for the completion of the tasks.
 */
export class PromiseWorkerProcessor<TData, TResult>
  implements WorkerProcessor<TData, TResult>
{
  constructor(private task: WorkerTask<TData, Promise<TResult>>) {}

  run(data: TData): Promise<Awaited<TResult>> {
    return this.task(data) as Promise<Awaited<TResult>>;
  }

  terminate(): Promise<void> {
    return Promise.resolve();
  }
}
