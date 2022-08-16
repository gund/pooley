export interface WorkerPoolScaler {
  getSize(): number;
  registerOnSizeChange(cb: WorkerPoolScalerSizeChangeCallback): void;
}

export type WorkerPoolScalerSizeChangeCallback = (size: number) => void;
