/**
 * @file Loading service
 * @module service.loading
 * @author Surmon <macichong@bytedance.com>
 */

import { ref, useRef, useReactive, computed } from '@/veact';

export function useLoading(initState = false) {
  return createLoading(initState, useRef);
}

export function createLoading(
  initState = false,
  referencer: typeof ref | typeof useRef = ref
) {
  const state = referencer(initState);

  const start = () => {
    state.value = true;
  };
  const stop = () => {
    state.value = false;
  };
  const handlePromise = <T>(promise: Promise<T>): Promise<T> => {
    start();
    return promise.finally(stop);
  };

  return {
    state,
    start,
    stop,
    promise: handlePromise,
  };
}

/**
 * @description 多 Loading 服务，适用于包含多个异步任务的上下文
 * @example
 *  const loadings = useLoadings('fetchList', 'postForm');
 *  loadings.start('fetchList');
 *  loadings.end('fetchList');
 *  loadings.isLoading('fetchList');
 *  loadings.promise(axios.get({ ... }));
 */

export function useLoadings(...names: Array<string>) {
  const loadingMap = useReactive(
    new Map<string, boolean>(names.map((name) => [name, false]))
  );
  const loadingNames = computed(() => Array.from(loadingMap.keys()));

  const setLoading = (key: string, value: boolean) => {
    loadingMap.set(key, value);
  };

  const start = (name: string) => setLoading(name, true);
  const stop = (name: string) => setLoading(name, false);
  const add = (name: string): void => {
    if (!loadingMap.has(name)) {
      setLoading(name, false);
    }
  };

  const isLoading = (name: string): boolean => Boolean(loadingMap.get(name));

  const isFinished = (name: string): boolean => !isLoading(name);

  const isSomeLoading = (): boolean =>
    loadingNames.value.some((name) => isLoading(name));

  const isAllFinished = (): boolean =>
    loadingNames.value.every((name) => isFinished(name));

  const handlePromise = <T>(name: string, promise: Promise<T>): Promise<T> => {
    start(name);
    promise.finally(() => stop(name));
    return promise;
  };

  return {
    loadingMap,
    promise: handlePromise,
    set: setLoading,
    start,
    stop,
    add,
    isLoading,
    isFinished,
    isSomeLoading,
    isAllFinished,
  };
}
