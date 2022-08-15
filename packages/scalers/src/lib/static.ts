import {
  WorkerPoolScaler,
  WorkerPoolScalerSizeChangeCallback,
} from '@pooley/core';

export class StaticWorkerPoolScaler implements WorkerPoolScaler {
  constructor(private size: number) {}

  registerOnSizeChange(cb: WorkerPoolScalerSizeChangeCallback): void {
    cb(this.size);
  }
}
