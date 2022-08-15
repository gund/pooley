export type WorkerPoolScalerSizeChangeCallback = (size: number) => void;

export interface WorkerPoolScaler {
  registerOnSizeChange(cb: WorkerPoolScalerSizeChangeCallback): void;
}
