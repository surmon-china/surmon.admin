/* eslint-disable react-hooks/rules-of-hooks */
// redirect all APIs from @vue/reactivity

import {
  effect as vEffect,
  computed as vComputed,
  reactive as vReactive,
  ref as vRef,
} from '@vue/reactivity';

import type {
  ComputedGetter,
  ComputedRef,
  ComputedSetter,
  DebuggerEvent,
  DeepReadonly,
  ReactiveEffect,
  ReactiveEffectOptions,
  Ref,
  RefUnwrapBailTypes,
  ToRefs,
  UnwrapRef,
  WritableComputedOptions,
  WritableComputedRef,
} from '@vue/reactivity';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getCompositionContext } from './context';
import { useForceUpdate } from './utils';

export {
  customRef,
  effect,
  enableTracking,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  ITERATE_KEY,
  markRaw,
  pauseTracking,
  readonly,
  resetTracking,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  stop,
  toRaw,
  toRef,
  toRefs,
  track,
  trigger,
  triggerRef,
  unref,
} from '@vue/reactivity';

const isRunInComponent = () => !!getCompositionContext();

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
  ? A
  : never;
type ArgumentsType<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : never;

export function watch<T>(
  fn: () => T,
  callback: (value: DebuggerEvent) => any,
  options?: ReactiveEffectOptions
) {
  const disposer = vEffect(fn, {
    ...options,
    onTrigger: callback,
  });

  if (!isRunInComponent()) {
    return disposer;
  }

  useEffect(() => {
    return () => {
      disposer();
    };
  }, []);
  return useMemo(() => disposer, []);
}

export function ref<T>(initValue: T) {
  const data = vRef(initValue);
  console.dirxml(['⚽️ ref', isRunInComponent() ? 'hook' : 'vue', initValue]);

  if (!isRunInComponent()) {
    return data;
  }

  const [value] = useState(data);
  const forceUpdate = useForceUpdate();
  watch(() => value.value, forceUpdate);
  return value;
}

export function reactive<T extends object>(target: T) {
  const data = vReactive(target);
  console.dirxml(['⚽️ reactive', isRunInComponent() ? 'hook' : 'vue', target]);

  if (!isRunInComponent()) {
    return data;
  }

  const value = useRef(data);
  const forceUpdate = useForceUpdate();
  watch(
    () => JSON.stringify(value.current),
    () => forceUpdate()
  );
  return value.current;
}

export function computed<T>(getter: ComputedGetter<T>) {
  const computer = vComputed(getter);
  console.dirxml(['⚽️ computed', isRunInComponent() ? 'hook' : 'vue', getter]);

  if (isRunInComponent()) {
    const value = useMemo(() => computer, []);
    const forceUpdate = useForceUpdate();
    watch(() => value.value, forceUpdate);
    return value;
  }

  return computer;
}
