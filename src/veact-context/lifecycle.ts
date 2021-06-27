// import React from 'react';
// import { assertCompositionContext } from './context';

// export function onMounted(callback: () => any) {
//   const context = assertCompositionContext();
//   context.addMounted(callback);
// }

// export function onUnmount(callback: () => void) {
//   const context = assertCompositionContext();
//   context.addDisposer(callback);
// }

// export function onUpdated(callback: () => void) {
//   const context = assertCompositionContext();
//   context.addUpdater(callback);
// }

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
//   // const context = assertCompositionContext()
//   // context.addExpose(value)
// }
