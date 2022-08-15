# @pooley/core

> Generic pool implementation that works with Webworkers, Promises, etc.

[![@pooley/core](https://badge.fury.io/js/@pooley%2Fcore.svg)](https://badge.fury.io/js/@pooley%2Fcore)

Requires a specific worker processor, queue and a scaler to excute.

See other packages for a suitable implementations.

## Install

Install the library:

```
npm install @pooley/core
```

## Usage

```ts
import { WorkerPool, WorkerTask, WorkerPoolEvent } from '@pooley/core';

// Create some task that should process a pool queue
const task: WorkerTask<string, Promise<string>> = (data) => {
  return new Promise((res) => setTimeout(() => res(data), 1000));
};

// Create a pool with a task and suitable queue/scaler/processor
const pool = new WorkerPool(task, queue, poolScaler, workerProcessorFactory);

// Listen to a processed data from the pool
pool.on(WorkerPoolEvent.Data, (ev) => this.log('Pool data: ', ev.data));

// Or wait when it's finished
await pool.once(WorkerPoolEvent.Empty);
```

## Building

Run `nx build core` to build the library.

## Running unit tests

Run `nx test core` to execute the unit tests via [Jest](https://jestjs.io).
