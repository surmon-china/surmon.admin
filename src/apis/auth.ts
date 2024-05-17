/**
 * @file Auth
 * @author Surmon <https://github.com/surmon-china>
 */

import { Base64 } from 'js-base64'
import nodepress from '@/services/nodepress'

export const AUTH_API_PATH = {
  AUTH: '/auth',
  LOGIN: '/auth/login',
  CHECK_TOKEN: '/auth/check',
  RENEWAL_TOKEN: '/auth/renewal'
}

export interface TokenResult {
  access_token: string
  expires_in: number
}

/** 登录 */
export function authLogin(password: string) {
  return nodepress
    .post<TokenResult>(AUTH_API_PATH.LOGIN, { password: Base64.encode(password) })
    .then((response) => response.result)
}

/** 续约 Token */
export function renewalToken() {
  return nodepress
    .post<TokenResult>(AUTH_API_PATH.RENEWAL_TOKEN)
    .then((response) => response.result)
}

/** 检查 Token 有效性 */
export function checkTokenValidity() {
  return nodepress.post<void>(AUTH_API_PATH.CHECK_TOKEN).then((response) => response.result)
}
