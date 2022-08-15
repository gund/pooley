import { WorkerPoolEvents } from './events';
import {
  WorkerProcessor,
  WorkerProcessorState,
  WorkerProcessorFactory,
} from './processor';
import { WorkerQueue } from './queue';
import { WorkerPoolScaler } from './scaler';
import { WorkerTask } from './task';

export class WorkerPool<D, R> {
  poolSize = 0;

  protected pool: WorkerProcessor<D, R>[] = [];

  private poolState: WorkerProcessorState[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private eventListeners: Record<string, ((event: any) => void)[]> = {};

  constructor(
    protected task: WorkerTask<D, R>,
    protected queue: WorkerQueue<D>,
    protected poolScaler: WorkerPoolScaler,
    protected processorFactory: WorkerProcessorFactory<D, R>
  ) {
    this.poolScaler.registerOnSizeChange(this.onPoolSizeChange.bind(this));
  }

  terminate() {
    this.pool.forEach((prosessor) => prosessor.terminate());
    this.poolState = this.pool.map(() => WorkerProcessorState.Idle);
  }

  destroy() {
    this.pool.forEach((processor) => this.processorFactory.destroy(processor));
    this.pool = [];
    this.poolState = [];
    this.eventListeners = {};
  }

  on<E extends keyof WorkerPoolEvents<R>>(
    event: E,
    listener: (event: WorkerPoolEvents<R>[E]) => void
  ) {
    const eventListeners =
      this.eventListeners[event] || (this.eventListeners[event] = []);

    eventListeners.push(listener);

    return () => {
      const listenerIdx = eventListeners.indexOf(listener);

      if (listenerIdx !== -1) {
        eventListeners.splice(listenerIdx, 1);
      }
    };
  }

  once<E extends keyof WorkerPoolEvents<R>>(
    event: E
  ): Promise<WorkerPoolEvents<R>[E]> {
    return new Promise((res) => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      let clearListener = () => {};

      const oneTimeListener = (event: WorkerPoolEvents<R>[E]) => {
        clearListener();
        res(event);
      };

      clearListener = this.on(event, oneTimeListener);
    });
  }

  protected emit<E extends keyof WorkerPoolEvents<R>>(
    event: E,
    eventData: WorkerPoolEvents<R>[E]
  ) {
    const eventListeners = this.eventListeners[event] || [];
    eventListeners.forEach((listener) => listener(eventData));
  }

  protected onPoolSizeChange(size: number) {
    if (size === this.poolSize) {
      return;
    }

    const poolDiff = size - this.poolSize;
    this.poolSize = size;

    if (poolDiff > 0) {
      this.growPoolBy(poolDiff);
    } else {
      this.shrinkPoolBy(Math.abs(poolDiff));
    }
  }

  protected growPoolBy(size: number) {
    for (let i = 0; i < size; i++) {
      this.processorFactory
        .create(this.task)
        .then((processor) => this.activate(processor));
    }
  }

  protected shrinkPoolBy(size: number) {
    const minI = Math.max(this.pool.length - size, 0);

    for (let i = this.pool.length - 1; i >= minI; i--) {
      this.processorFactory.destroy(this.pool[i]);
    }

    this.pool.splice(minI);
    this.poolState.splice(minI);
  }

  protected activate(processor: WorkerProcessor<D, R>) {
    const processorIdx = this.pool.push(processor) - 1;

    this.updatePoolState(processorIdx, WorkerProcessorState.Idle);
    this.process(processorIdx);
  }

  protected async process(processorIdx: number) {
    let processor: WorkerProcessor<D, R> | undefined;

    while ((processor = this.pool[processorIdx])) {
      this.verifyPoolEmpty();
      this.verifyPoolDrain();

      const data = await this.queue.request();

      this.updatePoolState(processorIdx, WorkerProcessorState.Busy);

      this.verifyPoolBusy();

      const result = await processor.run(data);

      this.updatePoolState(processorIdx, WorkerProcessorState.Idle);

      this.emit('data', { data: result });
    }
  }

  protected updatePoolState(processorIdx: number, state: WorkerProcessorState) {
    this.poolState[processorIdx] = state;
  }

  private verifyPoolEmpty() {
    if (!this.queue.isEmpty()) {
      return;
    }

    const poolAllIdle = this.poolState.every(
      (s) => s === WorkerProcessorState.Idle
    );

    if (!poolAllIdle) {
      return;
    }

    this.emit('empty', {});
  }

  private verifyPoolDrain() {
    if (this.queue.isEmpty()) {
      return;
    }

    const idleStates = this.poolState.filter(
      (s) => s === WorkerProcessorState.Idle
    );

    if (idleStates.length === 0) {
      return;
    }

    this.emit('drain', { idleProcessors: idleStates.length });
  }

  private verifyPoolBusy() {
    if (this.queue.isEmpty()) {
      return;
    }

    const poolHasIdle = this.poolState.some(
      (s) => s === WorkerProcessorState.Idle
    );

    if (poolHasIdle) {
      return;
    }

    this.emit('busy', {});
  }
}
