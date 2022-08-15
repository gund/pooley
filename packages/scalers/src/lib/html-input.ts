import {
  WorkerPoolScaler,
  WorkerPoolScalerSizeChangeCallback,
} from '@pooley/core';

export class HtmlInputWorkerPoolScaler implements WorkerPoolScaler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private changeSizeCb: WorkerPoolScalerSizeChangeCallback = () => {};

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
