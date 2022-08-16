export interface WorkerPoolScaler {
  registerOnSizeChange(cb: WorkerPoolScalerSizeChangeCallback): void;
}

export type WorkerPoolScalerSizeChangeCallback = (size: number) => void;
