/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cancellable, Constructor } from './types';

export type ListenableCallback<T = unknown> = (data: T) => void;

export interface Listenable<TEventMap> {
  on<TEvent extends keyof TEventMap>(
    event: TEvent,
    cb: ListenableCallback<TEventMap[TEvent]>
  ): Cancellable;
  once<TEvent extends keyof TEventMap>(
    event: TEvent
  ): Promise<TEventMap[TEvent]>;
}

export interface ListenableInternal<TEventMap> extends Listenable<TEventMap> {
  /** @internal */
  listeners: Map<
    keyof TEventMap,
    Set<ListenableCallback<TEventMap[keyof TEventMap]>>
  >;
  /** @internal */
  emit<TEvent extends keyof TEventMap>(
    event: TEvent,
    data?: TEventMap[TEvent]
  ): void;
}

export function listenable<
  TEventMap,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TBase extends Constructor = Constructor<{}>
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: TBase = Object as any
): TBase & ListenableInternal<TEventMap> {
  return class ListenableImpl
    extends base
    implements ListenableInternal<TEventMap>
  {
    listeners = new Map<
      keyof TEventMap,
      Set<ListenableCallback<TEventMap[keyof TEventMap]>>
    >();

    on<TEvent extends keyof TEventMap>(
      event: TEvent,
      cb: ListenableCallback<TEventMap[TEvent]>
    ): Cancellable {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set([cb as any]));
      } else {
        // Non-existing case is handled above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.listeners.get(event)!.add(cb as any);
      }

      return () => this.listeners.get(event)?.delete(cb as any);
    }

    once<TEvent extends keyof TEventMap>(
      event: TEvent
    ): Promise<TEventMap[TEvent]> {
      return new Promise((res) => {
        const off = this.on(event, (data) => {
          off();
          res(data);
        });
      });
    }

    emit<TEvent extends keyof TEventMap>(
      event: TEvent,
      data: TEventMap[TEvent]
    ) {
      this.listeners.get(event)?.forEach((cb) => cb(data));
    }
  } as any;
}
