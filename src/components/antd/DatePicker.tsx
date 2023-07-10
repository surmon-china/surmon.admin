// https://4x-ant-design.antgroup.com/docs/react/replace-moment-cn#DatePicker.tsx

import type { Dayjs } from 'dayjs'
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import generatePicker from 'antd/es/date-picker/generatePicker'

export default generatePicker<Dayjs>(dayjsGenerateConfig)
