/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  WorkerProcessor,
  WorkerProcessorFactory,
  WorkerTask,
} from '@pooley/core';

export class MockWorkerProcessor<TData = unknown, TResult = unknown>
  implements WorkerProcessor<TData, TResult>
{
  run = jest.fn();
  terminate = jest.fn();
}

export class MockWorkerProcessorFactory<TData, TResult>
  implements WorkerProcessorFactory<TData, TResult>
{
  create = jest
    .fn<
      Promise<MockWorkerProcessor<TData, TResult>>,
      [WorkerTask<TData, TResult>]
    >()
    .mockImplementation(() => Promise.resolve(new MockWorkerProcessor()));
  destroy = jest.fn<Promise<void>, [WorkerProcessor<TData, TResult>]>();
}
