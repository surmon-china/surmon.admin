/**
 * @desc General DropdownMenu
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Button, Dropdown } from 'antd'
import * as Icon from '@ant-design/icons'

export interface ButtonMenuProps {
  className?: string
  disabled?: boolean
  onClick?(): any
  options: Array<{
    icon?: React.ReactNode
    label: React.ReactNode
    onClick(): any
  }>
}

export const DropdownMenu: React.FC<React.PropsWithChildren<ButtonMenuProps>> = (props) => {
  return (
    <Dropdown
      className={props.className}
      disabled={props.disabled}
      menu={{
        items: props.options.map((option, index) => ({
          key: index,
          icon: option.icon,
          onClick: option.onClick,
          label: option.label
        }))
      }}
    >
      <Button disabled={props.disabled}>
        {props.children} <Icon.DownOutlined />
      </Button>
    </Dropdown>
  )
}
