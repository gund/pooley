import {
  WorkerPoolScaler,
  WorkerPoolScalerSizeChangeCallback,
} from '@pooley/core';

/**
 * Allocates a static number of workers based on a static size
 */
export class StaticWorkerPoolScaler implements WorkerPoolScaler {
  /**
   * @param size A static size of the workers
   */
  constructor(private size: number) {}

  registerOnSizeChange(cb: WorkerPoolScalerSizeChangeCallback): void {
    cb(this.size);
  }
}
