import {
  WorkerProcessor,
  WorkerProcessorFactory,
  WorkerTask,
} from '@pooley/core';

import { PromiseWorkerProcessor } from './processor';

export class PromiseWorkerProcessorFactory
  implements WorkerProcessorFactory<any, any>
{
  constructor(protected promiseWorkerProcessorType = PromiseWorkerProcessor) {}

  create(
    task: WorkerTask<any, Promise<any>>
  ): Promise<WorkerProcessor<any, any>> {
    return Promise.resolve(new this.promiseWorkerProcessorType(task));
  }

  destroy(processor: WorkerProcessor<any, Promise<any>>): Promise<void> {
    return processor.terminate();
  }
}
