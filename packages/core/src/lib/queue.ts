export interface WorkerQueue<TData> {
  isEmpty(): boolean;
  request(): Promise<TData>;
}
