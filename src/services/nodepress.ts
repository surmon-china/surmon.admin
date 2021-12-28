/**
 * @file HTTP requester service
 * @module service.http
 * @author Surmon <https://github.com/surmon-china>
 */

import { notification } from 'antd'
import axios, { AxiosInstance } from 'axios'

import { loading } from '@/state/loading'
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
  UNKNOWN_ERROR = 0, // 未知
}

export enum HTTPStatus {
  Error = 'error',
  Success = 'success',
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
  adapter: (window as any).__axiosAdapter || undefined,
})

// request
nodepress.interceptors.request.use((config) => {
  loading.start()
  if (token.isTokenValid()) {
    config.headers = config.headers || {}
    config.headers[APP_AUTH_HEADER_KEY] = `Bearer ${token.getToken()}`
  } else if (config.url !== AUTH_API_PATH.LOGIN) {
    notification.error({
      message: 'Token 无效',
      description: 'Token 不存在或是无效的',
      duration: 2,
    })
  }
  return config
})

// response
nodepress.interceptors.response.use(
  (response) => {
    if (!response.headers['content-type'].includes('json')) {
      loading.complete()
      notification.success({
        message: '数据请求成功',
        description: response.statusText,
        duration: 2,
      })
      return response
    } else if (response.data.status === HTTPStatus.Success) {
      loading.complete()
      notification.success({
        message: '数据请求成功',
        description: response.data.message,
        duration: 2,
      })
      return Promise.resolve(response.data)
    } else {
      loading.fail()
      notification.error({
        message: response.data.message,
        description: response.data.error,
        duration: 3,
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
      message: messageText + ': ' + errorText,
    }
    console.debug('axios error:', errorInfo)
    loading.fail()
    notification.error({
      message: messageText,
      description: errorText,
      duration: 3,
    })
    // 如果是 401，即：登陆失败，则删除 token 并跳转到登陆页
    if (error.response.status === HTTPCode.UNAUTHORIZED) {
      token.removeToken()
      window.location.href = rc(RouteKey.Hello).path
    }
    return Promise.reject(errorInfo)
  }
)

const service = {
  $: nodepress,
  request: <T = unknown>(
    ...args: Parameters<AxiosInstance['request']>
  ): Promise<HTTPResult<T>> => nodepress.request(...args),
  get: <T = unknown>(
    ...args: Parameters<AxiosInstance['get']>
  ): Promise<HTTPResult<T>> => nodepress.get(...args),
  delete: <T = unknown>(
    ...args: Parameters<AxiosInstance['delete']>
  ): Promise<HTTPResult<T>> => nodepress.delete(...args),
  head: <T = unknown>(
    ...args: Parameters<AxiosInstance['head']>
  ): Promise<HTTPResult<T>> => nodepress.head(...args),
  options: <T = unknown>(
    ...args: Parameters<AxiosInstance['options']>
  ): Promise<HTTPResult<T>> => nodepress.options(...args),
  post: <T = unknown>(
    ...args: Parameters<AxiosInstance['post']>
  ): Promise<HTTPResult<T>> => nodepress.post(...args),
  put: <T = unknown>(
    ...args: Parameters<AxiosInstance['put']>
  ): Promise<HTTPResult<T>> => nodepress.put(...args),
  patch: <T = unknown>(
    ...args: Parameters<AxiosInstance['patch']>
  ): Promise<HTTPResult<T>> => nodepress.patch(...args),
}

export default service
