import { WorkerProcessor, WorkerTask } from '@pooley/core';

/**
 * Allows to execute tasks in a pool using Promises to wait for the completion of the tasks.
 */
export class PromiseWorkerProcessor<D, R> implements WorkerProcessor<D, R> {
  constructor(private task: WorkerTask<D, Promise<R>>) {}

  run(data: D): Promise<Awaited<R>> {
    return this.task(data) as Promise<Awaited<R>>;
  }

  terminate(): Promise<void> {
    return Promise.resolve();
  }
}
