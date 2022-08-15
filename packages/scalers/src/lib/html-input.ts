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
  private changeSizeCb: WorkerPoolScalerSizeChangeCallback = () => {};

  /**
   * @param inputElem Input element to use
   * @param eventName Event name to watch for value changes. Default: 'change'
   */
  constructor(
    private inputElem: HTMLInputElement,
    private eventName = 'change'
  ) {
    this.inputElem.addEventListener(this.eventName, () => this.updateSize());
  }

  registerOnSizeChange(cb: WorkerPoolScalerSizeChangeCallback): void {
    this.changeSizeCb = cb;
    this.updateSize();
  }

  private updateSize() {
    this.changeSizeCb(+this.inputElem.value);
  }
}
