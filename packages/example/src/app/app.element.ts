import './app.element.css';

import { WorkerPool, WorkerPoolEvent, WorkerTask } from '@pooley/core';
import {
  StaticWorkerPoolScaler,
  HtmlInputWorkerPoolScaler,
} from '@pooley/scalers';
import { BufferedQueue } from '@pooley/queues';
import { PromiseWorkerProcessorFactory } from '@pooley/promise';
import { WebWorkerProcessorFactory } from '@pooley/webworker';

export class AppElement extends HTMLElement {
  static observedAttributes = [];

  private logsElement: HTMLElement;
  private rangeElement: HTMLInputElement;
  private rangeValueElement: HTMLElement;

  constructor(private _document = document, private _console = console) {
    super();
  }

  connectedCallback() {
    this.setup();
    this.main().catch(this._console.error);
  }

  private async main() {
    const queue = new BufferedQueue<string>();
    const staticPoolScaler = new StaticWorkerPoolScaler(5);
    const inputPoolScaler = new HtmlInputWorkerPoolScaler(this.rangeElement);
    const promiseProcessorFactory = new PromiseWorkerProcessorFactory();
    const webWorkerProcessorFactory = new WebWorkerProcessorFactory();

    const asyncTask: WorkerTask<string, Promise<string>> = (url) => {
      console.log('Executing Async task with url', url);
      return new Promise((res) => setTimeout(() => res(url), 1000));
    };

    const syncTask: WorkerTask<string, string> = (url) => {
      const start = Date.now();

      console.log('Executing Sync task with url', url);

      while (Date.now() - start < 1000) {
        // Waiting...
      }

      return url;
    };

    const pool = new WorkerPool(
      syncTask,
      queue,
      inputPoolScaler,
      webWorkerProcessorFactory
    );

    for (let i = 0; i < 100; i++) {
      queue.pushAll([`${i}`]);
    }

    pool.on(WorkerPoolEvent.Drain, () => this.log('Pool is draining!'));
    pool.on(WorkerPoolEvent.Busy, () => this.log('Pool is busy!'));
    pool.on(WorkerPoolEvent.Data, (ev) => this.log('Pool data: ', ev.data));

    await pool.once(WorkerPoolEvent.Empty);
    this.log('Pool is empty');

    pool.destroy();
  }

  private setup() {
    this.innerHTML = `
      <label>
        Pool Size
        <input type="range" min="1" max="10" value="1" class="range" />
        <span class="range-value"></span>
      </label>

      <ul class="logs"></ul>
      `;

    this.logsElement = this.querySelector('.logs')!;
    this.rangeElement = this.querySelector<HTMLInputElement>('.range')!;
    this.rangeValueElement = this.querySelector('.range-value')!;

    this.rangeElement.addEventListener(
      'change',
      this.updateRangeValue.bind(this)
    );
    this.updateRangeValue();
  }

  private updateRangeValue() {
    this.rangeValueElement.textContent = this.rangeElement.value;
  }

  private log(...msgs: any[]) {
    const logElem = this._document.createElement('li');
    logElem.innerText = msgs.join(' ');
    this.logsElement.prepend(logElem);
    this._console.log(...msgs);
  }
}

customElements.define('pooley-root', AppElement);
