/**
 * @file 通用的业务数据状态
 * @module constants.general-state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react';
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
  FireOutlined,
} from '@ant-design/icons';

/** 通用的数据扩展 */
export interface DataExtends {
  _id: string;
  name: string;
  value: string;
}

/** 数据排序状态 */
export enum SortType {
  Asc = 1, // 升序
  Desc = -1, // 降序
  Hot = 2, // 最热
}

const sortTypeMap = new Map(
  [
    {
      id: SortType.Desc,
      name: '最新',
      icon: <SortDescendingOutlined />,
    },
    {
      id: SortType.Asc,
      name: '最早',
      icon: <SortAscendingOutlined />,
    },
    {
      id: SortType.Hot,
      name: '最热',
      icon: <FireOutlined />,
    },
  ].map((item) => [item.id, item])
);

export const st = (state: SortType) => {
  return sortTypeMap.get(state)!;
};
export const sortTypes = Array.from<ReturnType<typeof st>>(sortTypeMap.values());
