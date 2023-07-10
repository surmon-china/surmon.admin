/**
 * @desc Placeholder
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import React from 'react'
import { Typography } from 'antd'

export interface PlaceholderProps<T = any> {
  data: T
  placeholder?: React.ReactNode
  children?(data: Exclude<T, null | undefined>): React.ReactNode
}

export function Placeholder<T = any>(props: PlaceholderProps<T>) {
  if (lodash.isNil(props.data)) {
    return <Typography.Text type="secondary">{props.placeholder ?? '-'}</Typography.Text>
  }

  const rendered = props.children?.(props.data as any)
  if (typeof rendered === 'string' || typeof rendered === 'number') {
    return <span>{rendered}</span>
  }

  return rendered || null
}
