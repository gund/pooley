import {
  WorkerProcessor,
  WorkerProcessorFactory,
  WorkerTask,
} from '@pooley/core';

import { WebWorkerProcessor } from './processor';

export class WebWorkerProcessorFactory<D, R>
  implements WorkerProcessorFactory<D, R>
{
  private taskToCode = new Map<WorkerTask<D, R>, string>();

  constructor(protected webWorkerProcessorType = WebWorkerProcessor<D, R>) {}

  create(task: WorkerTask<D, R>): Promise<WorkerProcessor<D, R>> {
    return Promise.resolve(
      new this.webWorkerProcessorType(this.getTaskCode(task))
    );
  }

  destroy(processor: WorkerProcessor<D, R>): Promise<void> {
    return processor.terminate();
  }

  private getTaskCode(task: WorkerTask<D, R>) {
    if (this.taskToCode.has(task)) {
      // Existence check is done above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.taskToCode.get(task)!;
    }

    const taskCode = this.generateTaskCode(task);
    this.taskToCode.set(task, taskCode);

    return taskCode;
  }

  private generateTaskCode(task: WorkerTask<D, R>) {
    function initWorker(
      this: DedicatedWorkerGlobalScope,
      task: WorkerTask<D, R>
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
