import {
  useEffect as useReactEffect,
  useMemo as useReactMemo,
  useState as useReactState,
} from 'react';

import {
  computed as vComputed,
  reactive as vReactive,
  shallowReactive as vShallowReactive,
  ref as vRef,
  ComputedGetter,
  ReactiveEffectOptions,
} from './reactivity';
import { watch, WatchFn, WatchCallback } from './watch';
import { useForceUpdate } from './utils';

/** Watch hook */
export function useWatch<T>(
  fn: WatchFn<T>,
  callback: WatchCallback<T>,
  options?: ReactiveEffectOptions
) {
  const [disposer] = useReactState(() => {
    // console.dirxml(['⚽️ useWatch', fn]);
    return watch(fn, callback, options);
  });
  useReactEffect(() => {
    return () => {
      // console.log('----⚽️ useWatch dispose', disposer);
      disposer?.();
    };
  }, []);
  return disposer;
}

export function useRef<T>(initValue: T) {
  const [value] = useReactState(() => {
    // console.dirxml(['⚽️ useRef', initValue]);
    return vRef(initValue);
  });
  const forceUpdate = useForceUpdate();
  useWatch(() => value.value, forceUpdate);
  return value;
}

export function useReactive<T extends object>(target: T) {
  const [value] = useReactState(() => {
    // console.dirxml(['⚽️ useReactive', target]);
    return vReactive(target);
  });
  const forceUpdate = useForceUpdate();
  useWatch(() => value, forceUpdate);
  return value;
}

export function useShallowReactive<T extends object>(target: T) {
  const [value] = useReactState(() => {
    // console.dirxml(['⚽️ vShallowReactive', target]);
    return vShallowReactive(target);
  });
  const forceUpdate = useForceUpdate();
  useWatch(() => value, forceUpdate);
  return value;
}

export function useComputed<T>(getter: ComputedGetter<T>) {
  const value = useReactMemo(() => {
    // console.dirxml(['⚽️ useComputed', getter]);
    return vComputed(getter);
  }, []);
  const forceUpdate = useForceUpdate();
  useWatch(() => value.value, forceUpdate);
  return value;
}

export function useReactivity<T = unknown>(getter: () => T) {
  // console.dirxml(['⚽️ useReactivity', getter()]);
  const forceUpdate = useForceUpdate();
  useWatch(() => getter(), forceUpdate);
  return getter();
}
