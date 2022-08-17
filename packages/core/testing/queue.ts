/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { WorkerQueue } from '@pooley/core';

export class MockQueue<TData = unknown> implements WorkerQueue<TData> {
  isEmpty = jest
    .fn<boolean, []>()
    .mockImplementation(() => this.queue.length === 0);
  request = jest.fn<Promise<TData>, []>().mockImplementation(() => {
    const promise = new Promise<TData>((res) => this.requests.push(res));
    this.flushRequests();
    return promise;
  });

  requests: ((data: TData) => void)[] = [];
  queue: TData[] = [];

  async push(...items: TData[]) {
    this.queue.push(...items);
    this.flushRequests();
  }

  flushRequests() {
    const queueSize = this.queue.length;
    const requestsSize = this.requests.length;
    const flushableSize = Math.min(queueSize, requestsSize);

    for (let i = 0; i < flushableSize; i++) {
      // Size boundary is calculated above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.requests.shift()!(this.queue.shift()!);
    }
  }
}
