/**
 * @file System
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import nodepress from '@/services/nodepress'
import { Option } from '@/constants/option'

export const OPTION_API_PATH = '/option'
export const ARCHIVE_API_PATH = '/archive'
export const EXPANSION_API_PATHS = {
  UPLOAD: '/expansion/upload',
  STATISTIC: '/expansion/statistic',
  GOOGLE_TOKEN: '/expansion/google-token',
  DATA_BASE_BACKUP: '/expansion/database-backup'
}

export interface Statistics {
  [key: string]: number
}

/** 获取全站统计信息 */
export function getStatistics() {
  return nodepress
    .get<Statistics>(EXPANSION_API_PATHS.STATISTIC)
    .then((response) => response.result)
}

export interface StatisticsCalendarItem {
  date: string
  count: number
}

/** 获取文章创作日历信息 */
export function getArticleCalendar() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return nodepress
    .get<StatisticsCalendarItem[]>('/article/calendar', { params: { timezone } })
    .then((response) => response.result)
}

/** 获取评论创建日历信息 */
export function getCommentCalendar() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return nodepress
    .get<StatisticsCalendarItem[]>('/comment/calendar', { params: { timezone } })
    .then((response) => response.result)
}

/** 获取 GA Token（仅适用于 V3） */
export function getGAToken(): Promise<string> {
  return nodepress
    .get<any>(EXPANSION_API_PATHS.GOOGLE_TOKEN)
    .then(({ result: credentials }) => credentials.access_token as string)
}

/** 更新 Archive 缓存 */
export function updateArchiveCache() {
  return nodepress.patch<void>(ARCHIVE_API_PATH).then((response) => response.result)
}

/** 更新数据库备份 */
export function updateDatabaseBackup() {
  return nodepress.patch(EXPANSION_API_PATHS.DATA_BASE_BACKUP).then((response) => response.result)
}

/** 获取系统配置 */
export function getOption() {
  return nodepress.get<Option>(OPTION_API_PATH).then((response) => response.result)
}

/** 更新系统配置 */
export function putOption(option: Option) {
  return nodepress.put<Option>(OPTION_API_PATH, option).then((response) => response.result)
}

/** 上传静态文件 */
export async function uploadStaticToNodePress(options: {
  file: File
  name: string
  onProgress?: (progress: number) => void
}) {
  const param = new FormData()
  param.append('file', options.file)
  param.append('name', options.name)
  return nodepress
    .post<{
      url: string
      key: string
      size: number
    }>(EXPANSION_API_PATHS.UPLOAD, param, {
      onUploadProgress: ({ loaded, total }) => {
        if (lodash.isNumber(total)) {
          const progress = (loaded / total) * 100
          options.onProgress?.(progress)
        }
      }
    })
    .then((response) => response.result)
}
