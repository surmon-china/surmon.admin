/**
 * @file Token
 * @module service.token
 * @author Surmon <https://github.com/surmon-china>
 */

import storage from './storage'

const TOKEN_STORAGE_KEY = 'id_token'
const TOKEN_BIRTH_TIME = 'token_birth_time'
const TOKEN_EXPIRES_IN = 'token_expires_in'

export const getToken = () => {
  return storage.get(TOKEN_STORAGE_KEY)
}

export const setToken = (token: string, expires_in: number): void => {
  storage.set(TOKEN_STORAGE_KEY, token)
  storage.set(TOKEN_EXPIRES_IN, String(expires_in))
  storage.set(TOKEN_BIRTH_TIME, String(+new Date() / 1000))
}

export const removeToken = () => {
  storage.remove(TOKEN_STORAGE_KEY)
  storage.remove(TOKEN_EXPIRES_IN)
  storage.remove(TOKEN_BIRTH_TIME)
}

export const isTokenValid = () => {
  const token = getToken()
  const tokenIsOk = token?.split('.').length === 3
  return tokenIsOk
}

export const getTokenCountdown = (): number => {
  const expiresIn = Number(localStorage.getItem(TOKEN_EXPIRES_IN))
  const borthTime = Number(localStorage.getItem(TOKEN_BIRTH_TIME))
  const deadLine = borthTime + expiresIn
  const now = +new Date() / 1000
  return deadLine > now ? Math.floor(deadLine - now) : 0
}

const token = {
  getToken,
  setToken,
  removeToken,
  isTokenValid,
  getTokenCountdown
}

export default token
