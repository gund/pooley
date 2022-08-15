# @pooley/promise

> Implements Promise-based processor for @pooley/core.

Allows to execute tasks in a pool using Promises to wait for the completion of the tasks.

Note: All tasks are executed on the same main thread and any blocking operations will block entire pool and everything else - so make sure you are using non-blocking operations inside your tasks!

## Usage

```ts
import { WorkerPool } from '@pooley/core';
import { PromiseWorkerProcessorFactory } from '@pooley/promise';

// Create a task that returns a Promise
const task: WorkerTask<string, Promise<string>> = (data) => {
  return new Promise((res) => setTimeout(() => res(data), 1000));
};

// Create a pool with promise processor factory
const pool = new WorkerPool(
  task,
  queue,
  poolScaler,
  new PromiseWorkerProcessorFactory()
);
```

## Building

Run `nx build promise` to build the library.

## Running unit tests

Run `nx test promise` to execute the unit tests via [Jest](https://jestjs.io).
