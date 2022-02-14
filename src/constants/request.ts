/**
 * @file Global http request and response interface
 * @author Surmon <https://github.com/surmon-china>
 */

/** 通用请求参数 */
export interface GeneralQueryParams {
  [key: string]: number | string | void
}

/** 通用翻页请求参数 */
export interface GeneralPaginateQueryParams extends GeneralQueryParams {
  page?: number
  per_page?: number
}

/** 翻页参数 */
export interface Pagination {
  current_page: number
  total_page: number
  per_page: number
  total: number
}

/** 数据体结构 */
export interface ResponseData<T> {
  data: T
}

/** 数据体结构 */
export interface ResponsePaginationData<T> {
  data: T[]
  pagination?: Pagination
}
