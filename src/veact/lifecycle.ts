/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';

export function onMounted(callback: () => any) {
  useEffect(() => {
    callback();
  }, []);
}

export function onUnmount(callback: () => void) {
  useEffect(() => {
    return () => {
      callback();
    };
  }, []);
}

export function onUpdated(callback: () => void) {
  useEffect(() => {
    callback();
  });
}

// export function inject<T>(Context: React.Context<T>): T {
//   const context = assertCompositionContext();
//   return context.addContext(Context);
// }

// export function useDisposer() {
//   const context = assertCompositionContext();
//   return (fn: () => void) => {
//     context.addDisposer(fn);
//   };
// }

// export function expose(value: any) {
// const context = assertCompositionContext()
// context.addExpose(value)
// }
