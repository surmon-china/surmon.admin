/**
 * @file 日期处理
 * @author Surmon <https://github.com/surmon-china>
 */

import dayjs from 'dayjs'

/** Dayjs → 秒时间戳 */
export const dayjsToTimestamp = (dayjs: dayjs.Dayjs) => dayjs.unix()

/** 秒时间戳 → Dayjs */
export const timestampToDayjs = (timestamp: number) => dayjs.unix(timestamp)

/** 时间戳 → YMD */
export const timestampToYMD = (timestamp: number) => {
  return dayjs(timestamp)?.format('YYYY-MM-DD HH:mm:ss')
}

/** 时间字符串 → YMD */
export const stringToYMD = (timestamp: string) => {
  return dayjs(timestamp)?.format('YYYY-MM-DD HH:mm:ss')
}
