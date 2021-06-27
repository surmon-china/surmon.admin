import { effect as vEffect } from './reactivity';
import type { ReactiveEffectOptions } from './reactivity';

export type WatchFn<F> = () => F;
export type WatchCallback<T> = (currentValue: T, prevValue: T) => any;

export function watch<T>(
  fn: WatchFn<T>,
  callback: WatchCallback<T>,
  options?: ReactiveEffectOptions
) {
  return vEffect(() => JSON.stringify(fn()), {
    ...options,
    onTrigger(event) {
      callback(event.newValue, event.oldValue);
    },
  });
}
