# @pooley/webworker

> Implements Webworker-based processor for @pooley/core.

[![@pooley/webworker](https://badge.fury.io/js/@pooley%2Fwebworker.svg)](https://badge.fury.io/js/@pooley%2Fwebworker)

Allows to execute tasks in a pool using Webworkers to fully parallelize pool processing.

Note: Since a task is executed in a different thread it cannot use any scoped variables from it's original thread as they will not exist in a Webworker thread - so use task arguments to pass all the nesessary data into a task.

## Install

Install the library with it's core peer dependency:

```
npm install @pooley/webworker @pooley/core
```

## Usage

```ts
import { WorkerPool } from '@pooley/core';
import { WebWorkerProcessor } from '@pooley/webworker';

// Create a task that will be executed in a WebWorker
const task: WorkerTask<string, string> = (data) => {
  while (Date.now() - start < 1000) {
    // Fully blocking the thread is fine here...
  }
  return data;
};

// Create a pool with webworker processor factory
const pool = new WorkerPool({
  task,
  queue,
  poolScaler,
  processorFactory: new WebWorkerProcessorFactory(),
});
```

## Building

Run `nx build webworker` to build the library.

## Running unit tests

Run `nx test webworker` to execute the unit tests via [Jest](https://jestjs.io).
