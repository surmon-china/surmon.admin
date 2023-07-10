/**
 * @desc Sort select
 * @author Surmon <https://github.com/surmon-china>
 */

import classnames from 'classnames'
import React from 'react'
import { Select, Space } from 'antd'
import { st, SortTypeBase, SortTypeWithHot } from '@/constants/sort'

import styles from './style.module.less'

export interface SortSelectProps {
  value?: number
  onChange?(value: number): void
  withHot?: boolean
  loading?: boolean
  disabled?: boolean
  className?: string
}

export const SortSelect: React.FC<SortSelectProps> = (props) => {
  const baseTypes = [SortTypeBase.Desc, SortTypeBase.Asc]
  const sortTypes = props.withHot ? [...baseTypes, SortTypeWithHot.Hot] : baseTypes

  return (
    <Select
      className={classnames(styles.select, props.className)}
      loading={props.loading}
      disabled={props.disabled}
      value={props.value}
      onChange={props.onChange}
      options={sortTypes.map((sortType) => {
        return {
          value: sortType,
          label: (
            <Space>
              {st(sortType).icon}
              {st(sortType).name}
            </Space>
          )
        }
      })}
    />
  )
}
