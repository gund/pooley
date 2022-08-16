import { WorkerPoolEvent, WorkerPoolEvents } from './events';
import {
  listenable,
  Listenable,
  ListenableEmitable,
  ListenableInternal,
} from './listenable';
import {
  WorkerProcessor,
  WorkerProcessorFactory,
  WorkerProcessorState,
} from './processor';
import { WorkerQueue } from './queue';
import { WorkerPoolScaler } from './scaler';
import { WorkerTask } from './task';

export interface WorkerPool<TData, TResult, TEvents = WorkerPoolEvents<TResult>>
  extends Listenable<TEvents> {}

interface WorkerPoolInternal<
  TData,
  TResult,
  TEvents = WorkerPoolEvents<TResult>
> extends WorkerPool<TData, TResult, TEvents>,
    ListenableEmitable<TEvents>,
    ListenableInternal<TEvents> {}

export class WorkerPool<
  TData,
  TResult,
  TEvents = WorkerPoolEvents<TResult>
> extends listenable() {
  protected poolSize = 0;
  protected pool: WorkerProcessor<TData, TResult>[] = [];
  protected poolState: WorkerProcessorState[] = [];

  constructor(
    protected task: WorkerTask<TData, TResult>,
    protected queue: WorkerQueue<TData>,
    protected poolScaler: WorkerPoolScaler,
    protected processorFactory: WorkerProcessorFactory<TData, TResult>
  ) {
    super();
    this.poolScaler.registerOnSizeChange(this.onPoolSizeChange.bind(this));
  }

  getSize() {
    return this.poolSize;
  }

  terminate() {
    this.pool.forEach((prosessor) => prosessor.terminate());
    this.poolState = this.pool.map(() => WorkerProcessorState.Idle);
  }

  destroy() {
    this.pool.forEach((processor) => this.processorFactory.destroy(processor));
    this.pool = [];
    this.poolState = [];
    this.int().listeners.clear();
  }

  protected int() {
    return this as unknown as WorkerPoolInternal<TData, TResult>;
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

  protected activate(processor: WorkerProcessor<TData, TResult>) {
    const processorIdx = this.pool.push(processor) - 1;

    this.updatePoolState(processorIdx, WorkerProcessorState.Idle);
    this.process(processorIdx);
  }

  protected async process(processorIdx: number) {
    let processor: WorkerProcessor<TData, TResult> | undefined;

    while ((processor = this.pool[processorIdx])) {
      this.verifyPoolEmpty();
      this.verifyPoolDrain();

      const data = await this.queue.request();

      this.updatePoolState(processorIdx, WorkerProcessorState.Busy);

      this.verifyPoolBusy();

      const result = await processor.run(data);

      this.updatePoolState(processorIdx, WorkerProcessorState.Idle);

      this.int().emit(WorkerPoolEvent.Data, { data: result });
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

    this.int().emit(WorkerPoolEvent.Empty);
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

    this.int().emit(WorkerPoolEvent.Drain, {
      idleProcessors: idleStates.length,
    });
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

    this.int().emit(WorkerPoolEvent.Busy);
  }
}
