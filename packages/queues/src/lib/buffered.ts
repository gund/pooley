import { WorkerQueue } from '@pooley/core';

export interface BufferedQueueConfig<T> {
  bufferSize?: number;
  bufferOverflowStrategy?(overSize: number, queue: BufferedQueue<T>): void;
}

export class BufferedQueue<T> implements WorkerQueue<T> {
  protected bufferSize: NonNullable<BufferedQueueConfig<T>['bufferSize']>;
  protected bufferOverflowStrategy: NonNullable<
    BufferedQueueConfig<T>['bufferOverflowStrategy']
  >;

  protected queue: T[] = [];
  protected requests: ((data: T) => void)[] = [];

  constructor(protected config?: BufferedQueueConfig<T>) {
    this.bufferSize = this.config?.bufferSize ?? Infinity;

    this.bufferOverflowStrategy =
      this.config?.bufferOverflowStrategy ??
      ((overSize) => {
        throw new Error(`BufferedQueue: Queue overflow size ${overSize}!`);
      });
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  pushAll(data: T[]) {
    const newQueueSize = this.queue.length + data.length;

    if (newQueueSize > this.bufferSize) {
      return this.bufferOverflowStrategy(newQueueSize, this);
    }

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

  protected flushRequests() {
    const maxSize = Math.min(this.queue.length, this.requests.length);

    for (let i = 0; i < maxSize; i++) {
      // Loop is withing queue bounds
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.requests[i](this.dequeue()!);
    }
  }

  protected dequeue() {
    return this.queue.shift();
  }
}
