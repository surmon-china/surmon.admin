import { shallowReactive } from '@vue/reactivity';
import { useContext } from 'react';

export interface CompositionContext<P = any, R = any> {
  // 添加前期准备器，这些回调在组件挂在后被调用
  addMounted: (cb: () => any) => void;
  // 重新渲染时被调用
  addUpdater: (cb: () => void) => void;
  // 添加释放器，这些回调将在组件卸载后被调用
  addDisposer: (cb: () => void) => void;
  // 添加 Context 值获取
  addContext: <T>(ctx: React.Context<T>) => T;
  // 添加通过ref暴露给外部的对象
  // addExpose: (value: any) => void
  _props: P;
  _isMounted: boolean;
  _instance?: R;
  _contexts: Map<React.Context<any>, { value: any; updater: () => void }>;
  _disposers: Array<() => void>;
  _mounted: Array<() => any>;
  _updater: Array<() => void>;
  // 给外部ref暴露方法
  // _exposer?: () => any
}

let compositionContext: CompositionContext | undefined;

export function getCompositionContext() {
  return compositionContext;
}

export function setCompositionContext(ctx: CompositionContext | undefined) {
  compositionContext = ctx;
}

export function assertCompositionContext(): CompositionContext {
  if (compositionContext == null) {
    throw new Error(`请在 setup 作用域下使用`);
  }

  return compositionContext;
}

export function createCompositionContext<P, R>(
  props: P
): CompositionContext<P, R> {
  const ctx: CompositionContext<P, R> = {
    _mounted: [],
    _updater: [],
    _disposers: [],
    _contexts: new Map(),
    _instance: undefined,
    // @ts-ignore
    _props: shallowReactive(props) as P,
    // _exposer: undefined
    _isMounted: false,
    // addExpose: (value: any) => (ctx._exposer = () => value),
    addMounted: (cb) => ctx._mounted.push(cb),
    addUpdater: (cb) => ctx._updater.push(cb),
    addDisposer: (cb) => ctx._disposers.push(cb),
    addContext: (context) => {
      // 已添加
      if (ctx._contexts.has(context)) {
        return ctx._contexts.get(context)!.value;
      }

      // eslint-disable-next-line
      let value = useContext(context)
      const wrapped = shallowReactive(value as any) as P;

      ctx._contexts.set(context, {
        value: wrapped,
        updater: () => {
          console.log('-----这是啥')
          const newValue = useContext(context)
          if (newValue !== value) {
            // set(wrapped, newValue)
            value = newValue
          }
        },
      });

      return wrapped as any;
    },
  };

  return ctx;
}
