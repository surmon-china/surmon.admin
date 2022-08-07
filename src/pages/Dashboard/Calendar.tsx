import moment from 'moment'
import classnames from 'classnames'
import React, { useMemo, useRef as useReactRef, WheelEventHandler } from 'react'
import { useRef, useComputed, onMounted, onBeforeUnmount } from 'veact'
import { useLoading } from 'veact-use'
import { Card, Tooltip, Divider, Typography } from 'antd'
import { ArticleCalendarItem, getArticleCalendar } from '@/store/system'

import styles from './style.module.less'

const CALENDAR_DAY_FORMAT = 'YYYY-MM-DD'
const CALENDAR_MONTH_FORMAT = 'YYYY/MM'
const getMonthFullDays = (month: moment.Moment) => {
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

  const loading = useLoading()
  const articleCalendar = useRef<Array<ArticleCalendarItem>>([])
  const fetchArticleCalendar = () => {
    return loading.promise(getArticleCalendar()).then((result) => {
      articleCalendar.value = result
    })
  }

  // current month | day
  const currentMonth = useMemo(() => {
    const today = moment()
    const days = Array.from({ length: today.date() }).map((_, i) => {
      return today.date(i + 1).format(CALENDAR_DAY_FORMAT)
    })
    return {
      title: today.format(CALENDAR_MONTH_FORMAT),
      days,
    }
  }, [])

  const months = useComputed(() => {
    const firstArticelDate = articleCalendar.value[0]?.date
    if (!firstArticelDate) {
      return []
    }

    const firstDay = moment(firstArticelDate)
    const today = moment()
    // prev months
    const duration = moment.duration(firstDay.diff(today))
    const months = Math.ceil(Math.abs(duration.as('month')))
    const monthsDays = Array.from({ length: months }).map((_, i) => {
      const month = today.clone().subtract(i + 1, 'month')
      const days = getMonthFullDays(month)
      return {
        title: month.format(CALENDAR_MONTH_FORMAT),
        days,
      }
    })

    return [...monthsDays.reverse(), currentMonth]
  })

  onMounted(() => {
    fetchArticleCalendar().then(() => {
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
    const count = articleCalendar.value.find((ac) => ac.date === date)?.count || 0
    const title = !count ? (
      date
    ) : (
      <span>
        {date}
        <Divider type="vertical" />
        <strong>{count}</strong>
      </span>
    )

    const brightnessStyle = !count
      ? {}
      : {
          filter: `brightness(${count * 0.5})`,
        }

    return (
      <Tooltip
        title={title}
        destroyTooltipOnHide={{ keepParent: false }}
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
      >
        <div
          className={classnames(styles.day, count ? styles.active : '')}
          style={brightnessStyle}
        ></div>
      </Tooltip>
    )
  }

  return (
    <Card bordered={false} className={styles.calendarCard} loading={loading.state.value}>
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
