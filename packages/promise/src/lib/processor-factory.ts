import {
  WorkerProcessor,
  WorkerProcessorFactory,
  WorkerTask,
} from '@pooley/core';

import { PromiseWorkerProcessor } from './processor';

export class PromiseWorkerProcessorFactory<D, R>
  implements WorkerProcessorFactory<D, Promise<R>>
{
  constructor(
    protected promiseWorkerProcessorType = PromiseWorkerProcessor<D, R>
  ) {}

  create(
    task: WorkerTask<D, Promise<R>>
  ): Promise<WorkerProcessor<D, Promise<R>>> {
    return Promise.resolve(new this.promiseWorkerProcessorType(task));
  }

  destroy(processor: WorkerProcessor<D, Promise<R>>): Promise<void> {
    return processor.terminate();
  }
}
