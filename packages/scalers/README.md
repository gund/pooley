# @pooley/scalers

> Implements different scalers for @pooley/core.

[![@pooley/scalers](https://badge.fury.io/js/@pooley%2Fscalers.svg)](https://badge.fury.io/js/@pooley%2Fscalers)

| Scaler                    | Description                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| StaticWorkerPoolScaler    | Allocates a static number of workers based on a static size                                                                    |
| HtmlInputWorkerPoolScaler | Allocates workers based on the current value of the HTMLInputElement and dynamically updates workers size as the value changes |

## Install

Install the library with it's core peer dependency:

```
npm install @pooley/scalers @pooley/core
```

## Usage

### StaticWorkerPoolScaler

```ts
import { WorkerPool } from '@pooley/core';
import { StaticWorkerPoolScaler } from '@pooley/scalers';

// Create a pool with static worker pool scaler
const pool = new WorkerPool({
  task,
  queue,
  poolScaler: new StaticWorkerPoolScaler(5),
  workerProcessorFactory,
});
```

### HtmlInputWorkerPoolScaler

```ts
import { WorkerPool } from '@pooley/core';
import { HtmlInputWorkerPoolScaler } from '@pooley/scalers';

// Create a pool with input worker pool scaler
const pool = new WorkerPool({
  task,
  queue,
  poolScaler: new HtmlInputWorkerPoolScaler(document.querySelector('input')),
  processorFactory,
});
```

## Building

Run `nx build scalers` to build the library.

## Running unit tests

Run `nx test scalers` to execute the unit tests via [Jest](https://jestjs.io).
