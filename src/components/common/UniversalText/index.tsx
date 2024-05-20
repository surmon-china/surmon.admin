/**
 * @desc Universal text
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Typography, Space } from 'antd'
import { BaseType } from 'antd/lib/typography/Base'
import { Placeholder, PlaceholderProps } from '../Placeholder'

export interface UniversalTextProps {
  text: React.ReactNode
  type?: BaseType
  className?: string
  copyable?: boolean
  strong?: boolean
  small?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  placeholder?: PlaceholderProps['placeholder']
}

export const UniversalText: React.FC<UniversalTextProps> = (props) => {
  return (
    <Space size="small" className={props.className}>
      {props.prefix}
      <Placeholder<React.ReactNode> data={props.text} placeholder={props.placeholder}>
        {(text) => (
          <Typography.Text copyable={props.copyable} type={props.type} strong={props.strong}>
            {props.small ? <small>{text}</small> : text}
          </Typography.Text>
        )}
      </Placeholder>
      {props.suffix}
    </Space>
  )
}
