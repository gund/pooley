import {
  WorkerProcessor,
  WorkerProcessorFactory,
  WorkerTask,
} from '@pooley/core';

import { PromiseWorkerProcessor } from './processor';

export class PromiseWorkerProcessorFactory<TData, TResult>
  implements WorkerProcessorFactory<TData, Promise<TResult>>
{
  constructor(
    protected promiseWorkerProcessorType = PromiseWorkerProcessor<
      TData,
      TResult
    >
  ) {}

  create(
    task: WorkerTask<TData, Promise<TResult>>
  ): Promise<WorkerProcessor<TData, Promise<TResult>>> {
    return Promise.resolve(new this.promiseWorkerProcessorType(task));
  }

  destroy(processor: WorkerProcessor<TData, Promise<TResult>>): Promise<void> {
    return processor.terminate();
  }
}
