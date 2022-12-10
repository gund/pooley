/* eslint-disable @typescript-eslint/no-empty-function */
import {
  MockQueue,
  MockScaler,
  MockWorkerProcessor,
  MockWorkerProcessorFactory,
} from '@pooley/core/testing';
import { WorkerPool } from './pool';

describe('WorkerPool', () => {
  it('should scale pool to current scaler size', () => {
    const mocks = createMocks();

    mocks.poolScaler.setSize(1);

    const { pool } = createPool(mocks);

    expect(pool.getSize()).toBe(1);
  });

  it('should rescale pool when scaler size changes', () => {
    const mocks = createMocks();

    mocks.poolScaler.setSize(1);

    const { pool } = createPool(mocks);

    expect(pool.getSize()).toBe(1);

    expect(mocks.poolScaler.registerOnSizeChange).toHaveBeenCalledWith(
      expect.any(Function),
    );

    mocks.poolScaler.setSize(2);

    expect(pool.getSize()).toBe(2);
  });

  it('should create processors with task when scaling up', () => {
    const mocks = createMocks();

    mocks.poolScaler.setSize(2);

    createPool(mocks);

    expect(mocks.processorFactory.create).toHaveBeenCalledTimes(2);
    expect(mocks.processorFactory.create).toHaveBeenCalledWith(mocks.task);
  });

  it('should destroy last processors when scaling down', async () => {
    const mocks = createMocks();

    mocks.poolScaler.setSize(2);

    createPool(mocks);

    await Promise.resolve();

    mocks.poolScaler.setSize(1);

    const secondProcessor = await mocks.processorFactory.create.mock.results[1]
      .value;

    expect(mocks.processorFactory.destroy).toHaveBeenCalledTimes(1);
    expect(mocks.processorFactory.destroy).toHaveBeenCalledWith(
      secondProcessor,
    );
  });

  it('should not run processor while waiting for queue', async () => {
    const mocks = createMocks();

    mocks.poolScaler.setSize(2);

    createPool(mocks);

    const firstProcessor = (await mocks.processorFactory.create.mock.results[0]
      .value) as MockWorkerProcessor;
    const secondProcessor = (await mocks.processorFactory.create.mock.results[1]
      .value) as MockWorkerProcessor;

    expect(firstProcessor.run).not.toHaveBeenCalled();
    expect(secondProcessor.run).not.toHaveBeenCalled();
  });

  it('should run processor when received data from queue', async () => {
    const mocks = createMocks();

    mocks.poolScaler.setSize(3);

    createPool(mocks);

    const firstProcessor = (await mocks.processorFactory.create.mock.results[0]
      .value) as MockWorkerProcessor;
    const secondProcessor = (await mocks.processorFactory.create.mock.results[1]
      .value) as MockWorkerProcessor;
    const thirdProcessor = (await mocks.processorFactory.create.mock.results[2]
      .value) as MockWorkerProcessor;

    await mocks.queue.push('data1');

    expect(firstProcessor.run).toHaveBeenCalledWith('data1');
    expect(secondProcessor.run).not.toHaveBeenCalled();

    await mocks.queue.push('data2', 'data3');

    expect(secondProcessor.run).toHaveBeenCalledWith('data2');
    expect(thirdProcessor.run).toHaveBeenCalledWith('data3');
  });

  describe('terminate() method', () => {
    it('should terminate all processors in the pool', () => {});
  });

  describe('destroy() method', () => {
    it('should destroy all processors in the pool', () => {});
  });

  describe('events', () => {});
});

function createMocks<TData, TResult>() {
  const task = jest.fn<TResult, [TData]>();
  const queue = new MockQueue<TData>();
  const poolScaler = new MockScaler();
  const processorFactory = new MockWorkerProcessorFactory<TData, TResult>();

  return { task, queue, poolScaler, processorFactory };
}

function createPool<TData, TResult>(config = createMocks<TData, TResult>()) {
  const pool = new WorkerPool(config);

  return { ...config, pool };
}
