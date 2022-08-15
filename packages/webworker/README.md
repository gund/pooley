# @pooley/webworker

> Implements Webworker-based processor for @pooley/core.

Allows to execute tasks in a pool using Webworkers to fully parallelize pool processing.

Note: Since a task is executed in a different thread it cannot use any scoped variables from it's original thread as they will not exist in a Webworker thread - so use task arguments to pass all the nesessary data into a task.

## Usage

```ts
import { WorkerPool } from '@pooley/core';
import { WebWorkerProcessor } from '@pooley/webworker';

// Create a webworker processor factory
const webWorkerProcessorFactory = new WebWorkerProcessorFactory();

// Create a task that will execute in a WebWorker
const task: WorkerTask<string, string> = (data) => {
  while (Date.now() - start < 1000) {
    // Fully blocking the thread is fine here...
  }
  return data;
};

// Create a pool with it
const pool = new WorkerPool(task, queue, poolScaler, webWorkerProcessorFactory);
```

## Building

Run `nx build webworker` to build the library.

## Running unit tests

Run `nx test webworker` to execute the unit tests via [Jest](https://jestjs.io).
