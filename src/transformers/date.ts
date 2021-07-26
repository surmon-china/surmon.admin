/**
 * @file 日期处理
 * @author Surmon <https://github.com/surmon-china>
 */

import moment from 'moment'

/** Moment → 秒时间戳 */
export const momentToTimestamp = (moment: moment.Moment) => moment.unix()

/** 秒时间戳 → Moment */
export const timestampToMoment = (timestamp: number) => moment.unix(timestamp)

/** 时间戳 → YMD */
export const timestampToYMD = (timestamp: number) => {
  return moment(timestamp)?.format('YYYY-MM-DD HH:mm:ss')
}

/** 时间字符串 → YMD */
export const stringToYMD = (timestamp: string) => {
  return moment(timestamp)?.format('YYYY-MM-DD HH:mm:ss')
}
