import { Ref, UnwrapNestedRefs, isReactive, isRef } from '@/veact';

export function bindRef<T extends Ref>(refValue: T) {
  return {
    value: refValue.value,
    onChange(newValue: any) {
      refValue.value = newValue;
    },
  };
}
