/**
 * @file NodePress request service
 * @author Surmon <https://github.com/surmon-china>
 */

import { notification } from 'antd'
import axios, { AxiosInstance, Method as AxiosMethod } from 'axios'
import { API_URL, APP_AUTH_HEADER_KEY } from '@/config'
import { AUTH_API_PATH } from '@/apis/auth'
import { RoutesKey, RoutesPath } from '@/routes'
import { i18n } from '@/i18n'
import token from './token'

enum HttpCode {
  SUCCESS = 200,
  CREATE_SUCCESS = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NO_PERMISSION = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  GATEWAY_TIMEOUT = 504,
  UNKNOWN_ERROR = 0
}

export enum HttpStatus {
  Error = 'error',
  Success = 'success'
}

export interface HttpResult<T = any> {
  status: HttpStatus.Success
  debug?: any
  error: string
  message: string
  result: T
}

export interface RequestParams {
  [key: string]: string | number
}

export const nodepress = axios.create({
  baseURL: API_URL,
  // MARK: WORKAROUND for demo site
  adapter: (window as any).__axiosAdapter || undefined
})

// request interceptor
nodepress.interceptors.request.use((config) => {
  if (token.isTokenValid()) {
    config.headers = config.headers || {}
    config.headers[APP_AUTH_HEADER_KEY] = `Bearer ${token.getToken()}`
  } else if (config.url !== AUTH_API_PATH.LOGIN) {
    notification.error({
      message: i18n.t('nodepress.request.invalid_token.title'),
      description: i18n.t('nodepress.request.invalid_token.description'),
      duration: 2
    })
  }
  return config
})

// response interceptor
nodepress.interceptors.response.use(
  (response) => {
    if (!response.headers['content-type']?.includes('json')) {
      notification.success({
        message: i18n.t('nodepress.response.success'),
        description: response.statusText,
        duration: 2
      })
      return response
    } else if (response.data.status === HttpStatus.Success) {
      notification.success({
        message: i18n.t('nodepress.response.success'),
        description: response.data.message,
        duration: 2
      })
      return Promise.resolve(response.data)
    } else {
      notification.error({
        message: response.data.message,
        description: response.data.error,
        duration: 3
      })
      return Promise.reject(response)
    }
  },
  (error) => {
    const errorJSON = error?.toJSON?.()
    const messageText = error.response?.data?.message || 'Error'
    const errorText =
      error.response?.data?.error || error.response?.statusText || errorJSON?.message || ''
    const errorInfo = {
      ...errorJSON,
      config: error.config,
      request: error.request,
      response: error.response,
      code: error.code || error.response?.status || HttpCode.BAD_REQUEST,
      message: `${messageText}: ${errorText}`
    }

    console.debug('axios error:', errorInfo)
    notification.error({
      message: messageText,
      description: errorText,
      duration: 3
    })

    // If a 401 response is received, it means that the authentication has failed,
    // the token is deleted and you are redirected to the login page.
    if (error.response?.status === HttpCode.UNAUTHORIZED) {
      token.removeToken()
      window.location.href = RoutesPath[RoutesKey.Hello]
    }
    return Promise.reject(errorInfo)
  }
)

type Method = Exclude<Lowercase<AxiosMethod>, 'unlink' | 'purge' | 'link'> | 'request'
const overwrite = (method: Method) => {
  return <T = any>(...args: Parameters<AxiosInstance[typeof method]>): Promise<HttpResult<T>> => {
    return (nodepress[method] as any)(...args)
  }
}

export default {
  $: nodepress,
  request: overwrite('request'),
  head: overwrite('head'),
  get: overwrite('get'),
  post: overwrite('post'),
  put: overwrite('put'),
  patch: overwrite('patch'),
  delete: overwrite('delete'),
  options: overwrite('options')
}
