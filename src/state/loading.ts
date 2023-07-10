/**
 * @desc Global loading state
 * @author Surmon <https://github.com/surmon-china>
 */

import { reactive, readonly, useReactivity } from 'veact'

const _throttle = 400
const _duration = 160
let _completeTimer: number | null = null
let _animationTimer: number | null = null
const state = reactive({
  loading: false,
  failed: false,
  percent: 0
})

const ensureClearCompleteTimeout = () => {
  if (_completeTimer) {
    window.clearTimeout(_completeTimer)
  }
}

const ensureClearAnimationTimeout = () => {
  if (_animationTimer) {
    window.clearTimeout(_animationTimer)
  }
}

const makeCompleteTimer = (callback?: () => void) => {
  ensureClearCompleteTimeout()
  _completeTimer = window.setTimeout(() => {
    state.percent = 100
    ensureClearAnimationTimeout()
    _animationTimer = window.setTimeout(() => {
      state.failed = false
      state.loading = false
      state.percent = 0
      callback?.()
    }, _duration)
  }, _throttle)
}

export const loadingState = {
  state: readonly(state),
  start() {
    ensureClearCompleteTimeout()
    ensureClearAnimationTimeout()
    state.loading = true
    state.percent += (100 - state.percent) / 2
  },
  complete() {
    state.failed = false
    makeCompleteTimer()
  },
  fail() {
    // TODO: LoadingBar background style BUG
    // state.failed = true;
    makeCompleteTimer()
  }
}

export const useLoadingState = () => {
  return useReactivity(() => loadingState)
}
