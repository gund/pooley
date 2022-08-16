import { WorkerPoolScaler } from '@pooley/core';

/**
 * Allocates a static number of workers based on a static size
 */
export class StaticWorkerPoolScaler implements WorkerPoolScaler {
  /**
   * @param size A static size of the workers
   */
  constructor(private readonly size: number) {}

  getSize(): number {
    return this.size;
  }

  registerOnSizeChange(): void {
    // Static size will never change
  }
}
