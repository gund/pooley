import './app.element.css';

import { WorkerPool, WorkerTask } from '@pooley/core';
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

  connectedCallback() {
    this.innerHTML = `
      <label>
        Pool Size
        <input type="range" min="1" max="10" value="1" class="range" />
        <span class="range-value"></span>
      </label>

      <ul class="logs"></ul>
      `;

    this.setup();
    this.main().catch(console.error);
  }

  private async main() {
    this.setup();

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

    pool.on('drain', () => this.log('Pool is draining!'));
    pool.on('busy', () => this.log('Pool is busy!'));
    pool.on('data', (ev) => this.log('Pool data: ', ev.data));

    await pool.once('empty');
    this.log('Pool is empty');
  }

  private setup() {
    this.logsElement = document.querySelector('.logs')!;
    this.rangeElement = document.querySelector<HTMLInputElement>('.range')!;
    this.rangeValueElement = document.querySelector('.range-value')!;

    this.rangeElement.addEventListener('change', this.updateRangeValue);
    this.updateRangeValue();
  }

  private updateRangeValue() {
    this.rangeValueElement.textContent = this.rangeElement.value;
  }

  private log(...msgs: any[]) {
    const logElem = document.createElement('li');
    logElem.innerText = msgs.join(' ');
    this.logsElement.prepend(logElem);
    console.log(...msgs);
  }
}
customElements.define('pooley-root', AppElement);
