# @pooley/queues

> Implements different queues for @pooley/core.

| Queue         | Description                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------ |
| BufferedQueue | Allows to buffer requests to dequeue elements from a queue and flush them once data has arrived. |

## Usage

### BufferedQueue

```ts
import { WorkerPool } from '@pooley/core';
import { BufferedQueue } from '@pooley/queues';

// Create a buffered queue
const queue = new BufferedQueue<string>();

// Create a pool with it
const pool = new WorkerPool(task, queue, poolScaler, workerProcessorFactory);

// Start pushing into the queue
queue.pushAll(['some', 'data']);
```

#### Configuration

| Option                 | Default         | Description                                                                                            |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| bufferSize             | Infinity        | Maximum size of dequeue requests that queue should buffer before triggering a buffer overflow strategy |
| bufferOverflowStrategy | Throws an error | A strategy function that is triggered when the dequeue buffer is overflown                             |

## Building

Run `nx build queues` to build the library.

## Running unit tests

Run `nx test queues` to execute the unit tests via [Jest](https://jestjs.io).
