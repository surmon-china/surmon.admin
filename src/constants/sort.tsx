/**
 * @file General sort state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

const ASC = 1 // 升序
const DESC = -1 // 降序

export enum SortTypeBase {
  Asc = ASC,
  Desc = DESC
}

export enum SortTypeWithHot {
  Asc = ASC,
  Desc = DESC,
  Hot = 2
}

const sortTypes = [
  {
    id: SortTypeWithHot.Desc,
    name: '最新',
    icon: <Icons.SortDescendingOutlined />
  },
  {
    id: SortTypeWithHot.Asc,
    name: '最早',
    icon: <Icons.SortAscendingOutlined />
  },
  {
    id: SortTypeWithHot.Hot,
    name: '最热',
    icon: <Icons.FireOutlined />
  }
]

const sortTypeMap = new Map(sortTypes.map((item) => [item.id, item]))

export const getSortType = (state: number) => {
  return sortTypeMap.get(state)!
}
