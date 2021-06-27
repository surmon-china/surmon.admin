import { effect, ReactiveEffect, DebuggerEvent } from '@vue/reactivity';
import React, { useImperativeHandle, useEffect, memo, FC } from 'react';
import {
  createCompositionContext,
  getCompositionContext,
  CompositionContext,
  setCompositionContext,
} from './context';
import { EMPTY_ARRAY, useForceUpdate, executeCallbacks } from './utils';

export interface ICreateComponentOptions {
  name?: string;
  forwardRef?: boolean;
}
export function createComponent<Props extends {}, Ref = void>(
  setup: (props: React.PropsWithChildren<Props>) => () => React.ReactElement,
  options: ICreateComponentOptions = {}
): FC<Props> {
  // const { name, forwardRef } = options;
  // console.debug('-----createComponent')

  const CompositionComponent = (props: Props, ref: React.RefObject<Ref>) => {
    // console.debug('-----CompositionComponent')
    const forceUpdate = useForceUpdate();
    const contextRef = React.useRef<CompositionContext | undefined>();
    const watcherRef = React.useRef<{
      reaction: ReactiveEffect;
      disposer: () => void;
    } | null>(null);

    // 初始化
    if (contextRef.current == null) {
      // console.log('-----contextRef')
      const context = createCompositionContext(props);
      const prevContext = getCompositionContext();
      contextRef.current = context;
      setCompositionContext(context);
      context._instance = setup(context._props);
      setCompositionContext(prevContext);
    }

    const render = contextRef.current._instance;

    if (watcherRef.current == null) {
      watcherRef.current = {
        reaction: effect(() => render(), {
          onTrigger: () => {
            // console.log('-----onTrigger')
          },
          onTrack: () => {
            // console.log('-----onTrack')
            forceUpdate();
          },
        }),
        disposer: () => {
          if (!watcherRef.current?.reaction.active) {
            const a = watcherRef.current?.reaction();
            watcherRef.current = null;
          }
        },
      };
    }

    useEffect(() => () => watcherRef.current?.disposer(), []);

    let renderResult: React.ReactElement;
    let error: any = null;
    try {
      renderResult = render();
    } catch (err) {
      error = err;
    }

    if (error) {
      watcherRef.current?.disposer();
      throw error;
    }

    // @ts-expect-error
    return renderResult;
  };

  CompositionComponent.displayName = `Composition(${
    options?.name || 'Unknown'
  })`;

  return CompositionComponent;

  // const TargetComponent = options?.forwardRef
  //   ? React.memo(React.forwardRef(CompositionComponent))
  //   : React.memo(CompositionComponent)
  // if (options?.name) {
  //   TargetComponent.displayName = options.name
  // }

  // return TargetComponent;
}
