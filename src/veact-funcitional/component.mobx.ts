// @ts-nocheck
import { set, Reaction } from 'mobx';
import { observer } from 'mobx-react';
import React, { useImperativeHandle, useEffect, memo, FC } from 'react';
import {
  createCompositionContext,
  getCompositionContext,
  CompositionContext,
  setCompositionContext,
} from './context';
import { EMPTY_ARRAY, useForceUpdate, executeCallbacks } from './utils';

export function initial<Props extends object, Rtn, Ref>(
  setup: (props: Props) => Rtn
) {
  return function useComposition(
    props: Props,
    ref?: React.RefObject<Ref>
  ): Rtn {
    const context = React.useRef<CompositionContext | undefined>();

    // 初始化
    if (context.current == null) {
      const ctx = (context.current = createCompositionContext(props));
      const prevCtx = getCompositionContext();
      setCompositionContext(ctx);
      ctx._instance = setup(ctx._props);
      setCompositionContext(prevCtx);
    }

    if (context.current._contexts.size && context.current._isMounted) {
      for (const { updater } of context.current._contexts.values()) {
        updater();
      }
    }

    if (ref && context.current._exposer != null) {
      // eslint-disable-next-line
      useImperativeHandle(ref, context.current._exposer, [
        context.current._exposer,
      ]);
    }

    // 更新
    useEffect(() => {
      const ctx = context.current;
      if (ctx._isMounted) executeCallbacks(ctx._updater);
    });

    useEffect(() => {
      const ctx = context.current;
      ctx._isMounted = true;
      // 已挂载
      if (ctx._mounted.length) {
        ctx._mounted.forEach((cb) => {
          const rt = cb();
          if (typeof rt === 'function') {
            ctx.addDisposer(rt);
          }
        });
        ctx._mounted = EMPTY_ARRAY;
      }

      return () => executeCallbacks(ctx._disposers);
    }, []);

    // props 更新
    set(context.current._props, props);

    return context.current._instance!;
  };
}

export interface ICreateComponentOption {
  name?: string;
  forwardRef?: boolean;
}
export function createComponent<Props extends {}, Ref = void>(
  setup: (props: Props) => () => React.ReactElement,
  option?: ICreateComponentOption
): FC<Props> {
  const useComposition = initial(setup);
  const CompositionComponent = observer((props) => {
    const render = useComposition(props);
    return render();
  });
  CompositionComponent.displayName = `Composition(${
    option?.name || 'Unknown'
  })`;

  const TargetComponent = option?.forwardRef
    ? React.memo(React.forwardRef(CompositionComponent))
    : React.memo(CompositionComponent);
  if (option?.name) {
    TargetComponent.displayName = option.name;
  }

  return TargetComponent;
}
