import { useReducer } from 'react';

export const EMPTY_ARRAY = [];
export const increment = (s: number, a?: void) => s + 1;
export const useForceUpdate = () => useReducer(increment, 0)[1];
export function executeCallbacks(callbacks: Array<() => void>) {
  if (callbacks.length) {
    callbacks.forEach((i) => i());
  }
}

export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
};

export const isObject = (value: unknown): value is object => {
  return Object.prototype.toString.call(value) === '[Object Object]';
};
