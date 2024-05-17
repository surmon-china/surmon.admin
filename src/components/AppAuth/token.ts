import { renewalToken } from '@/apis/auth'
import { getTokenCountdown, setToken } from '@/services/token'

let renewalTimer: null | number = null

// Stop renewal token
export const stopRenewalToken = (): void => {
  if (typeof renewalTimer === 'number') {
    window.clearTimeout(renewalTimer)
  }
}

// Auto renewal token
export const runRenewalToken = (): void => {
  stopRenewalToken()
  const countdown = getTokenCountdown()
  const seconds = countdown - 10
  console.debug(
    `Token auto-renewal is working.`,
    `Token will be updated automatically after ${seconds}s!`
  )
  renewalTimer = window.setTimeout(() => {
    renewalToken().then((auth) => {
      setToken(auth.access_token, auth.expires_in)
      runRenewalToken()
    })
  }, seconds * 1000)
}
