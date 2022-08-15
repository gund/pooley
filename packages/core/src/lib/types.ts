// eslint-disable-next-line @typescript-eslint/ban-types
export interface Constructor<T = {}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  prototype: T;
}

export type Cancellable = () => void;
