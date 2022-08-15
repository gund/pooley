import { WorkerProcessor } from '@pooley/core';

/**
 * Allows to execute tasks in a pool using Webworkers to fully parallelize pool processing
 *
 * The code of the task is converted into a worker stringified code by the factory
 */
export class WebWorkerProcessor<D, R> implements WorkerProcessor<D, R> {
  private worker?: Worker;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private cleanupWorker = () => {};
  private resolver?: (res: Awaited<R>) => void;
  private rejector?: (err: unknown) => void;

  constructor(private workerCode: string) {}

  run(data: D): Promise<Awaited<R>> {
    return new Promise((res, rej) => {
      this.resolver = res;
      this.rejector = rej;

      const transfer: Transferable[] = [];

      if (
        data instanceof ArrayBuffer ||
        data instanceof MessagePort ||
        data instanceof ImageBitmap
      ) {
        transfer.push(data);
      }

      if (!this.worker) {
        this.worker = this.createWorker();
      }

      this.worker.postMessage(data, transfer);
    });
  }

  terminate(): Promise<void> {
    this.cleanupWorker();
    return Promise.resolve();
  }

  private createWorker() {
    this.cleanupWorker();

    const worker = new Worker(this.workerCode, { type: 'module' });

    const onMessage = (ev: MessageEvent) => {
      if (this.resolver) {
        this.resolver(ev.data);
        this.resolver = undefined;
      }
    };

    const onError = (ev: ErrorEvent) => {
      if (this.rejector) {
        this.rejector(ev.error);
        this.rejector = undefined;
      }
    };

    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);

    this.cleanupWorker = () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.cleanupWorker = () => {};
      worker.terminate();
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
    };

    return worker;
  }
}
