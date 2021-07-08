/**
 * @desc Global general state
 * @author Surmon <https://github.com/surmon-china>
 */

import { reactive, readonly, watch, useReactivity } from '@/veact';

const general = reactive({
  fullscreen: false,
});

watch(
  () => general.fullscreen,
  (fullscreen) => {
    fullscreen
      ? document.body.classList.add('fullscreen')
      : document.body.classList.remove('fullscreen');
  }
);

const setFullscreen = (value: boolean) => {
  general.fullscreen = value;
};

export const generalState = {
  data: readonly(general),
  setFullscreen,
};

export const useGeneralState = () => ({
  ...generalState,
  data: useReactivity(() => generalState.data),
});
