import {
  WorkerProcessor,
  WorkerProcessorFactory,
  WorkerTask,
} from '@pooley/core';

import { WebWorkerProcessor } from './processor';

export class WebWorkerProcessorFactory
  implements WorkerProcessorFactory<any, any>
{
  private taskToCode = new Map<WorkerTask<any, any>, string>();

  constructor(protected webWorkerProcessorType = WebWorkerProcessor) {}

  create(task: WorkerTask<any, any>): Promise<WorkerProcessor<any, any>> {
    return Promise.resolve(
      new this.webWorkerProcessorType(this.getTaskCode(task))
    );
  }

  destroy(processor: WorkerProcessor<any, any>): Promise<void> {
    return processor.terminate();
  }

  private getTaskCode(task: WorkerTask<any, any>) {
    if (this.taskToCode.has(task)) {
      return this.taskToCode.get(task)!;
    }

    const taskCode = this.generateTaskCode(task);
    this.taskToCode.set(task, taskCode);

    return taskCode;
  }

  private generateTaskCode(task: WorkerTask<any, any>) {
    function initWorker(
      this: DedicatedWorkerGlobalScope,
      task: WorkerTask<any, any>
    ) {
      this.onmessage = (e) => {
        const result = task(e.data);
        const transfer: Transferable[] = [];

        if (
          result instanceof ArrayBuffer ||
          result instanceof MessagePort ||
          result instanceof ImageBitmap
        ) {
          transfer.push(result);
        }

        this.postMessage(result, transfer);
      };
    }

    return `data:text/javascript;charset=UTF-8,(${initWorker.toString()}).call(self, ${task.toString()});`;
  }
}
