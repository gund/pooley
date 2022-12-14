import './app.element.css';

import { WorkerPool, WorkerPoolEvent, WorkerTask } from '@pooley/core';
import { BufferedQueue } from '@pooley/queues';
import { HtmlInputWorkerPoolScaler } from '@pooley/scalers';
import { WebWorkerProcessorFactory } from '@pooley/webworker';

export class AppElement extends HTMLElement {
  static observedAttributes = [];

  private logsElement!: HTMLElement;
  private rangeElement!: HTMLInputElement;
  private rangeValueElement!: HTMLElement;

  constructor(private _document = document, private _console = console) {
    super();
  }

  connectedCallback() {
    this.setup();
    this.main().catch(this._console.error);
  }

  private async main() {
    const task: WorkerTask<string, string> = (url) => {
      const start = Date.now();

      console.log('Executing Sync task with url', url);

      while (Date.now() - start < 1000) {
        // Waiting...
      }

      return url;
    };

    const queue = new BufferedQueue<string>();
    const poolScaler = new HtmlInputWorkerPoolScaler(this.rangeElement);
    const processorFactory = new WebWorkerProcessorFactory<string, string>();

    const pool = new WorkerPool({ task, queue, poolScaler, processorFactory });

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

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    this.rangeElement = this.querySelector<HTMLInputElement>('.range')!;
    this.rangeValueElement = this.querySelector('.range-value')!;
    this.logsElement = this.querySelector('.logs')!;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    this.rangeElement.addEventListener(
      'change',
      this.updateRangeValue.bind(this),
    );
    this.updateRangeValue();
  }

  private updateRangeValue() {
    this.rangeValueElement.textContent = this.rangeElement.value;
  }

  private log(...msgs: unknown[]) {
    const logElem = this._document.createElement('li');
    logElem.innerText = msgs.join(' ');
    this.logsElement.prepend(logElem);
    this._console.log(...msgs);
  }
}

customElements.define('pooley-root', AppElement);
