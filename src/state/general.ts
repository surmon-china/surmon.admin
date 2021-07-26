/**
 * @desc Global general state
 * @author Surmon <https://github.com/surmon-china>
 */

import { reactive, readonly, watch } from 'veact';

const state = reactive({
  fullscreen: false,
});

watch(
  () => state.fullscreen,
  (fullscreen) => {
    fullscreen
      ? document.body.classList.add('fullscreen')
      : document.body.classList.remove('fullscreen');
  }
);

const setFullscreen = (value: boolean) => {
  state.fullscreen = value;
};

export const general = {
  state: readonly(state),
  setFullscreen,
};
