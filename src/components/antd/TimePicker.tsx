// https://4x-ant-design.antgroup.com/docs/react/replace-moment-cn#TimePicker.tsx

import React from 'react'
import type { Dayjs } from 'dayjs'
import DatePicker from './DatePicker'
import { PickerTimeProps } from 'antd/es/date-picker/generatePicker'

export type TimePickerProps = Omit<PickerTimeProps<Dayjs>, 'picker'>

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
  return <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
})

TimePicker.displayName = 'TimePicker'

export default TimePicker
