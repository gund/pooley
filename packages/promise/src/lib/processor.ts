import { WorkerProcessor, WorkerTask } from '@pooley/core';

export class PromiseWorkerProcessor
  implements WorkerProcessor<any, Promise<any>>
{
  constructor(private task: WorkerTask<any, Promise<any>>) {}

  run(data: any): Promise<any> {
    return this.task(data);
  }

  terminate(): Promise<void> {
    return Promise.resolve();
  }
}
