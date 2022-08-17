/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  WorkerPoolScaler,
  WorkerPoolScalerSizeChangeCallback,
} from '@pooley/core';

export class MockScaler implements WorkerPoolScaler {
  getSize = jest.fn<number, []>();
  registerOnSizeChange = jest.fn<void, [WorkerPoolScalerSizeChangeCallback]>();

  setSize(size: number) {
    this.getSize.mockReset().mockReturnValue(size);
    this.registerOnSizeChange.mock.calls[0]?.[0]?.(size);
  }
}
