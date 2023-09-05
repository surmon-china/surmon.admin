import dayjs from 'dayjs'
import classnames from 'classnames'
import React, { useMemo, useRef as useReactRef, WheelEventHandler } from 'react'
import { useRef, useComputed, onMounted, onBeforeUnmount } from 'veact'
import { useLoading } from 'veact-use'
import { Card, Tooltip, Divider, Typography } from 'antd'
import { StatisticsCalendarItem, getArticleCalendar, getCommentCalendar } from '@/store/system'

import styles from './style.module.less'

const CALENDAR_DAY_FORMAT = 'YYYY-MM-DD'
const CALENDAR_MONTH_FORMAT = 'YYYY/MM'
const getMonthFullDays = (month: dayjs.Dayjs) => {
  const daysCount = month.daysInMonth()
  return Array.from({ length: daysCount }).map((d, i) => {
    return month.date(i + 1).format(CALENDAR_DAY_FORMAT)
  })
}

export const Calendar: React.FC = () => {
  const calendarElement = useReactRef<HTMLDivElement>(null)
  const handleCalendarScroll: WheelEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    if (calendarElement.current) {
      if (event.deltaY > 0) {
        calendarElement.current.scrollLeft += calendarElement.current.clientWidth / 2
      } else {
        calendarElement.current.scrollLeft -= calendarElement.current.clientWidth / 2
      }
    }
  }

  const calendarloading = useLoading()
  const articleCalendar = useRef<Array<StatisticsCalendarItem>>([])
  const commentCalendar = useRef<Array<StatisticsCalendarItem>>([])
  const fetchCalendarData = async () => {
    const [acResult, ccResult] = await calendarloading.promise(
      Promise.all([getArticleCalendar(), getCommentCalendar()])
    )
    articleCalendar.value = acResult
    commentCalendar.value = ccResult
  }

  // current month | day
  const currentMonth = useMemo(() => {
    const today = dayjs()
    const days = Array.from({ length: today.date() }).map((_, i) => {
      return today.date(i + 1).format(CALENDAR_DAY_FORMAT)
    })
    return {
      title: today.format(CALENDAR_MONTH_FORMAT),
      days
    }
  }, [])

  const months = useComputed(() => {
    const firstArticelDate = articleCalendar.value[0]?.date
    const firstCommentDate = commentCalendar.value[0]?.date
    if (!firstArticelDate && !firstCommentDate) {
      return []
    }

    const firstDay = dayjs(firstArticelDate || firstCommentDate)
    const today = dayjs()
    // prev months
    const duration = dayjs.duration(firstDay.diff(today))
    const months = Math.ceil(Math.abs(duration.as('month')))
    const monthsDays = Array.from({ length: months }).map((_, i) => {
      const month = today.clone().subtract(i + 1, 'month')
      const days = getMonthFullDays(month)
      return {
        title: month.format(CALENDAR_MONTH_FORMAT),
        days
      }
    })

    return [...monthsDays.reverse(), currentMonth]
  })

  onMounted(() => {
    fetchCalendarData().then(() => {
      setTimeout(() => {
        if (calendarElement.current) {
          calendarElement.current.scrollLeft = calendarElement.current.scrollWidth
          calendarElement.current.addEventListener('wheel', handleCalendarScroll as any)
        }
      }, 0)
    })
  })

  onBeforeUnmount(() => {
    calendarElement.current?.removeEventListener('wheel', handleCalendarScroll as any)
  })

  const renderDay = (date: string) => {
    const articleCount = articleCalendar.value.find((i) => i.date === date)?.count || 0
    const commentCount = commentCalendar.value.find((i) => i.date === date)?.count || 0
    const total = articleCount + commentCount
    const getPointHeightStyle = (value: number) => {
      return isNaN(value) ? 0 : `${Math.floor(value * 100)}%`
    }

    return (
      <Tooltip
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        destroyTooltipOnHide={{ keepParent: false }}
        title={
          total ? (
            <div>
              <Typography.Text strong>{date}</Typography.Text>
              <Divider type="horizontal" style={{ margin: '6px 0' }} />
              <div style={{ marginBottom: 4 }}>文章: {articleCount}</div>
              <div>评论：{commentCount}</div>
            </div>
          ) : (
            <Typography.Text type="secondary">{date} (无)</Typography.Text>
          )
        }
      >
        <div
          className={classnames(styles.day)}
          data-date={date}
          data-total-count={total}
          data-article-count={articleCount}
          data-comment-count={commentCount}
        >
          {!articleCount ? null : (
            <div
              className={classnames(styles.item, styles.article)}
              style={{
                height: getPointHeightStyle(articleCount / total),
                filter: `brightness(${articleCount * 0.5})`
              }}
            />
          )}
          {!commentCount ? null : (
            <div
              className={classnames(styles.item, styles.comment)}
              style={{
                height: getPointHeightStyle(commentCount / total),
                filter: `brightness(${commentCount * 0.3})`
              }}
            />
          )}
        </div>
      </Tooltip>
    )
  }

  return (
    <Card bordered={false} className={styles.calendarCard} loading={calendarloading.state.value}>
      <div className={styles.calendar} ref={calendarElement}>
        {months.value.map((month, index) => (
          <div className={styles.month} key={index}>
            <div className={styles.title}>
              <Typography.Text strong type="secondary">
                {month.title}
              </Typography.Text>
            </div>
            <div className={styles.days}>
              {month.days.map((day, i) => (
                <React.Fragment key={i}>{renderDay(day)}</React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
