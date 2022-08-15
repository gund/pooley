export interface WorkerQueue<D> {
  isEmpty(): boolean;
  request(): Promise<D>;
}
