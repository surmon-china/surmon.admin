/**
 * @file HTTP requester service
 * @module service.http
 * @author Surmon <https://github.com/surmon-china>
 */

import { notification } from 'antd'
import axios, { AxiosInstance, Method as AxiosMethod } from 'axios'

import { loadingState } from '@/state/loading'
import { AUTH_API_PATH } from '@/store/auth'
import { API_URL, APP_AUTH_HEADER_KEY } from '@/config'
import { rc, RouteKey } from '@/routes'
import token from './token'

enum HTTPCode {
  SUCCESS = 200,
  CREATE_SUCCESS = 201, // 创建成功
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401, // 未授权
  NO_PERMISSION = 403, // 无权限
  NOT_FOUND = 404,
  SERVER_ERROR = 500, // 服务器挂了
  GATEWAY_TIMEOUT = 504, // 请求超时
  UNKNOWN_ERROR = 0 // 未知
}

export enum HTTPStatus {
  Error = 'error',
  Success = 'success'
}

// 请求参数
export interface RequestParams {
  [key: string]: string | number
}

// 响应体
export interface IResponse {
  status: number
  statusText?: string
  message?: string
  error?: any
}

// 响应数据
export interface HTTPResult<T = any> {
  status: HTTPStatus.Success
  debug?: any
  error: string
  message: string
  result: T
}

const nodepress = axios.create({
  baseURL: API_URL,
  // adapter: WORKAROUND for outside
  adapter: (window as any).__axiosAdapter || undefined
})

// request
nodepress.interceptors.request.use((config) => {
  loadingState.start()
  if (token.isTokenValid()) {
    config.headers = config.headers || {}
    config.headers[APP_AUTH_HEADER_KEY] = `Bearer ${token.getToken()}`
  } else if (config.url !== AUTH_API_PATH.LOGIN) {
    notification.error({
      message: 'Token 无效',
      description: 'Token 不存在或是无效的',
      duration: 2
    })
  }
  return config
})

// response
nodepress.interceptors.response.use(
  (response) => {
    if (!response.headers['content-type']?.includes('json')) {
      loadingState.complete()
      notification.success({
        message: '数据请求成功',
        description: response.statusText,
        duration: 2
      })
      return response
    } else if (response.data.status === HTTPStatus.Success) {
      loadingState.complete()
      notification.success({
        message: '数据请求成功',
        description: response.data.message,
        duration: 2
      })
      return Promise.resolve(response.data)
    } else {
      loadingState.fail()
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
      error.response?.data?.error || error.response?.statusText || errorJSON?.message
    const errorInfo = {
      ...errorJSON,
      config: error.config,
      request: error.request,
      response: error.response,
      code: error.code || error.response?.status || HTTPCode.BAD_REQUEST,
      message: messageText + ': ' + errorText
    }
    console.debug('axios error:', errorInfo)
    loadingState.fail()
    notification.error({
      message: messageText,
      description: errorText,
      duration: 3
    })
    // 如果是 401，即：登陆失败，则删除 token 并跳转到登陆页
    if (error.response?.status === HTTPCode.UNAUTHORIZED) {
      token.removeToken()
      window.location.href = rc(RouteKey.Hello).path
    }
    return Promise.reject(errorInfo)
  }
)

type Method = Exclude<Lowercase<AxiosMethod>, 'unlink' | 'purge' | 'link'> | 'request'
const overwrite = (method: Method) => {
  return <T = any>(...args: Parameters<AxiosInstance[typeof method]>): Promise<HTTPResult<T>> => {
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
