import {
  WorkerProcessor,
  WorkerProcessorFactory,
  WorkerTask,
} from '@pooley/core';

import { WebWorkerProcessor } from './processor';

export class WebWorkerProcessorFactory<TData, TResult>
  implements WorkerProcessorFactory<TData, TResult>
{
  private taskToCode = new Map<WorkerTask<TData, TResult>, string>();

  constructor(
    protected webWorkerProcessorType = WebWorkerProcessor<TData, TResult>
  ) {}

  create(
    task: WorkerTask<TData, TResult>
  ): Promise<WorkerProcessor<TData, TResult>> {
    return Promise.resolve(
      new this.webWorkerProcessorType(this.getTaskCode(task))
    );
  }

  destroy(processor: WorkerProcessor<TData, TResult>): Promise<void> {
    return processor.terminate();
  }

  private getTaskCode(task: WorkerTask<TData, TResult>) {
    if (this.taskToCode.has(task)) {
      // Existence check is done above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.taskToCode.get(task)!;
    }

    const taskCode = this.generateTaskCode(task);
    this.taskToCode.set(task, taskCode);

    return taskCode;
  }

  private generateTaskCode(task: WorkerTask<TData, TResult>) {
    function initWorker(
      this: DedicatedWorkerGlobalScope,
      task: WorkerTask<TData, TResult>
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
