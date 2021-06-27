export interface CompositionContext<P = any> {
  component: any;
  props: P;
}

let compositionContext: CompositionContext | undefined;

export function getCompositionContext() {
  return compositionContext;
}

export function setCompositionContext(context: CompositionContext | undefined) {
  compositionContext = context;
}

export function assertCompositionContext(): CompositionContext {
  if (compositionContext == null) {
    throw new Error(`请在 createComponent 作用域下使用 Veact hook`);
  }

  return compositionContext;
}

export function createCompositionContext<P>(
  component: any,
  props?: P
): CompositionContext {
  const context: CompositionContext = {
    component,
    props,
  };

  return context;
}
