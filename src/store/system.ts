/**
 * @file System store
 * @author Surmon <https://github.com/surmon-china>
 */

import http from '@/services/http'
import { Option } from '@/constants/option'

export const OPTION_API_PATH = '/option'
export const SYNDICATION_API_PATH = '/syndication'
export const EXPANSION_API_PATH = {
  UP_TOKEN: '/expansion/uptoken',
  STATISTIC: '/expansion/statistic',
  GOOGLE_TOKEN: '/expansion/google-token',
  DATA_BASE_BACKUP: '/expansion/database-backup',
}

export interface Statistics {
  [key: string]: number
}
/** 获取全站统计信息 */
export function getStatistics() {
  return http
    .get<Statistics>(EXPANSION_API_PATH.STATISTIC)
    .then((response) => response.result)
}

/** 获取 GA Token */
export function getGAToken(): Promise<string> {
  return http
    .get<any>(EXPANSION_API_PATH.GOOGLE_TOKEN)
    .then(({ result: credentials }) => credentials.access_token as string)
}

/** 更新 Syndication 缓存（RSS） */
export function updateSyndicationCache() {
  return http.patch<void>(SYNDICATION_API_PATH).then((response) => response.result)
}

/** 更新数据库备份 */
export function updateDatabaseBackup() {
  return http
    .patch(EXPANSION_API_PATH.DATA_BASE_BACKUP)
    .then((response) => response.result)
}

/** 获取系统配置 */
export function getOption() {
  return http.get<Option>(OPTION_API_PATH).then((response) => response.result)
}

/** 更新系统配置 */
export function putOption(option: Option) {
  return http.put<Option>(OPTION_API_PATH, option).then((response) => response.result)
}

export interface AliYunOSSUpToken {
  AccessKeyId: string
  AccessKeySecret: string
  SecurityToken: string
  Expiration: string
}

/** 获取 AliYun OSS 上传 Token */
export function getOSSUpToken() {
  return http
    .get<AliYunOSSUpToken>(EXPANSION_API_PATH.UP_TOKEN)
    .then((response) => response.result)
}
