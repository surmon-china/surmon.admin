// https://4x-ant-design.antgroup.com/docs/react/replace-moment-cn#Calendar.tsx

import type { Dayjs } from 'dayjs'
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import generateCalendar from 'antd/es/calendar/generateCalendar'

export default generateCalendar<Dayjs>(dayjsGenerateConfig)
