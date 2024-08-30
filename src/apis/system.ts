/**
 * @file System
 * @author Surmon <https://github.com/surmon-china>
 */

import _isNumber from 'lodash/isNumber'
import nodepress from '@/services/nodepress'
import { Option } from '@/constants/option'

export const OPTION_API_PATH = '/option'
export const ARCHIVE_API_PATH = '/archive'
export const EXTENSION_API_PATHS = {
  STATISTIC: '/extension/statistic',
  DATA_BASE_BACKUP: '/extension/database-backup'
}

export interface Statistics {
  [key: string]: number
}

/** 获取全站统计信息 */
export function getStatistics() {
  return nodepress
    .get<Statistics>(EXTENSION_API_PATHS.STATISTIC)
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

/** 更新 Archive 缓存 */
export function updateArchiveCache() {
  return nodepress.patch<void>(ARCHIVE_API_PATH).then((response) => response.result)
}

/** 更新数据库备份 */
export function updateDatabaseBackup() {
  return nodepress.patch(EXTENSION_API_PATHS.DATA_BASE_BACKUP).then((response) => response.result)
}

/** 获取系统配置 */
export function getOption() {
  return nodepress.get<Option>(OPTION_API_PATH).then((response) => response.result)
}

/** 更新系统配置 */
export function putOption(option: Option) {
  return nodepress.put<Option>(OPTION_API_PATH, option).then((response) => response.result)
}
