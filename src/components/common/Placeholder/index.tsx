/**
 * @desc Placeholder
 * @author Surmon <https://github.com/surmon-china>
 */

import lodash from 'lodash'
import React from 'react'
import { Typography } from 'antd'

export interface PlaceholderProps<T = any> {
  data: T
  placeholder?: React.ReactChild
  children?(data: Exclude<T, null | undefined>): React.ReactChild
}

export function Placeholder<T = any>(props: React.PropsWithChildren<PlaceholderProps<T>>) {
  if (lodash.isNil(props.data)) {
    return <Typography.Text type="secondary">{props.placeholder ?? '-'}</Typography.Text>
  }

  const rendered = props.children?.(props.data!)
  if (typeof rendered === 'string' || typeof rendered === 'number') {
    return <span>{rendered}</span>
  }

  return rendered || null
}
