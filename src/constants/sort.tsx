/**
 * @file General sort state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icon from '@ant-design/icons'

const ASC = 1 // 升序
const DESC = -1 // 降序

export enum SortTypeBase {
  Asc = ASC,
  Desc = DESC,
}

export enum SortTypeWithHot {
  Asc = ASC,
  Desc = DESC,
  Hot = 2,
}

const sortTypeMap = new Map(
  [
    {
      id: SortTypeWithHot.Desc,
      name: '最新',
      icon: <Icon.SortDescendingOutlined />,
    },
    {
      id: SortTypeWithHot.Asc,
      name: '最早',
      icon: <Icon.SortAscendingOutlined />,
    },
    {
      id: SortTypeWithHot.Hot,
      name: '最热',
      icon: <Icon.FireOutlined />,
    },
  ].map((item) => [item.id, item])
)

export const st = (state: number) => sortTypeMap.get(state)!
