/**
 * @file General bussniess constant
 * @author Surmon <https://github.com/surmon-china>
 */

/** 通用的数据扩展 */
export interface GeneralKeyValue {
  name: string
  value: string
}

export interface IPLocation {
  country?: string
  country_code?: string
  region?: string
  region_code?: string
  city?: string
  zip?: string
}
