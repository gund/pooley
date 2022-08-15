import { WorkerProcessor } from '@pooley/core';

export class WebWorkerProcessor implements WorkerProcessor<any, any> {
  private worker?: Worker;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private cleanupWorker = () => {};
  private resolver?: (res: any) => void;
  private rejector?: (err: any) => void;

  constructor(private workerCode: string) {}

  run(data: any): Promise<any> {
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
