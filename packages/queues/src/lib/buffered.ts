import { WorkerQueue } from '@pooley/core';

export class BufferedQueue<T> implements WorkerQueue<T> {
  private queue: T[] = [];
  private requests: ((data: T) => void)[] = [];

  isEmpty() {
    return this.queue.length === 0;
  }

  pushAll(data: T[]) {
    this.queue.push(...data);

    if (this.requests.length > 0) {
      this.flushRequests();
    }
  }

  request(): Promise<T> {
    if (!this.isEmpty()) {
      // Empty check is done above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Promise.resolve<T>(this.dequeue()!);
    }

    return new Promise((res) => this.requests.push(res));
  }

  private flushRequests() {
    const maxSize = Math.min(this.queue.length, this.requests.length);

    for (let i = 0; i < maxSize; i++) {
      // Loop is withing queue bounds
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.requests[i](this.dequeue()!);
    }
  }

  private dequeue() {
    return this.queue.shift();
  }
}
