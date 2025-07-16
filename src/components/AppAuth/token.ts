import { refreshToken } from '@/apis/admin'
import { getTokenCountdown, setToken } from '@/services/token'

let refreshTimer: null | number = null

// Stop refresh token
export const stopTokenAutoRefresh = (): void => {
  if (typeof refreshTimer === 'number') {
    window.clearTimeout(refreshTimer)
  }
}

// Auto refresh token
export const startTokenAutoRefresh = (): void => {
  stopTokenAutoRefresh()
  const countdown = getTokenCountdown()
  const seconds = countdown - 10
  console.debug(
    `Token auto-refresh is working.`,
    `Token will be updated automatically after ${seconds}s!`
  )
  refreshTimer = window.setTimeout(() => {
    refreshToken().then((auth) => {
      setToken(auth.access_token, auth.expires_in)
      startTokenAutoRefresh()
    })
  }, seconds * 1000)
}
