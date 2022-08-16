import {
  WorkerPoolScaler,
  WorkerPoolScalerSizeChangeCallback,
} from '@pooley/core';

/**
 * Allocates workers based on the current value of the HTMLInputElement
 * and dynamically updates workers size as the value changes
 */
export class HtmlInputWorkerPoolScaler implements WorkerPoolScaler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected updateSize: WorkerPoolScalerSizeChangeCallback = () => {};

  /**
   * @param inputElem Input element to use
   * @param eventName Event name to watch for value changes. Default: 'change'
   */
  constructor(
    private readonly inputElem: HTMLInputElement,
    private readonly eventName = 'change'
  ) {
    this.inputElem.addEventListener(this.eventName, () =>
      this.updateSize(this.getSize())
    );
  }

  getSize(): number {
    return +this.inputElem.value;
  }

  registerOnSizeChange(cb: WorkerPoolScalerSizeChangeCallback): void {
    this.updateSize = cb;
  }
}
