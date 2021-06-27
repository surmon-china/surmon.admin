import React, { useEffect } from 'react';
import {
  setCompositionContext,
  getCompositionContext,
  createCompositionContext,
} from './context';

export interface ICreateComponentOptions {
  name?: string;
  forwardRef?: boolean;
}
export function createComponent<Props extends {}, Ref = void>(
  fc: React.FC<Props>,
  options: ICreateComponentOptions = {}
): React.FC<Props> {
  return (props: Props, ...args) => {
    const prevContext = getCompositionContext();
    const context = createCompositionContext(fc, props);
    setCompositionContext(context);
    useEffect(() => {
      return () => {
        setCompositionContext(prevContext);
      };
    }, []);

    return fc(props, ...args);
  };
}
