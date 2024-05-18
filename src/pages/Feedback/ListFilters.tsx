import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { Trans } from '@/i18n'
import { SortSelect } from '@/components/common/SortSelect'
import { SortTypeBase } from '@/constants/sort'
import { MarkedState } from '@/constants/feedback'

import styles from './style.module.less'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = {
  marked: false as boolean,
  tid: SELECT_ALL_VALUE as number | typeof SELECT_ALL_VALUE,
  emotion: SELECT_ALL_VALUE as number | typeof SELECT_ALL_VALUE,
  sort: SortTypeBase.Desc
}

export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  tid: params.tid !== SELECT_ALL_VALUE ? params.tid : void 0,
  emotion: params.emotion !== SELECT_ALL_VALUE ? params.emotion : void 0,
  marked: params.marked ? MarkedState.Yes : void 0,
  sort: params.sort
})

export interface ListFiltersProps {
  loading: boolean
  keyword: string
  params: FilterParams
  onParamsChange(value: Partial<FilterParams>): void
  onKeywordChange(keyword: string): void
  onKeywordSearch(): void
  onResetRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  return (
    <Flex justify="space-between" gap="middle" wrap className={styles.listFilters}>
      <Space wrap>
        <Button
          loading={props.loading}
          type={props.params.marked ? 'primary' : 'default'}
          icon={props.params.marked ? <Icons.StarFilled /> : <Icons.StarOutlined />}
          onClick={() => props.onParamsChange({ marked: !props.params.marked })}
        >
          标记数据
        </Button>
        <Select
          className={styles.select}
          loading={props.loading}
          value={props.params.tid}
          onChange={(tid) => props.onParamsChange({ tid })}
          options={[
            {
              value: SELECT_ALL_VALUE,
              label: '所有反馈'
            },
            {
              value: 0,
              label: '站点反馈'
            }
          ]}
          dropdownRender={(menu) => (
            <div>
              {menu}
              <div className={styles.postIdInput}>
                <Input.Search
                  allowClear={true}
                  size="small"
                  type="number"
                  className={styles.input}
                  placeholder="TID"
                  enterButton={<span>GO</span>}
                  onSearch={(tid) => props.onParamsChange({ tid: Number(tid) })}
                />
              </div>
            </div>
          )}
        />
        <Select
          className={styles.select}
          loading={props.loading}
          value={props.params.emotion}
          onChange={(emotion) => props.onParamsChange({ emotion })}
          options={[
            { value: SELECT_ALL_VALUE, label: '所有评分' },
            { value: 1, label: '1 分' },
            { value: 2, label: '2 分' },
            { value: 3, label: '3 分' },
            { value: 4, label: '4 分' },
            { value: 5, label: '5 分' }
          ]}
        />
        <SortSelect
          loading={props.loading}
          value={props.params.sort}
          onChange={(sort) => props.onParamsChange({ sort })}
        />
        <Input.Search
          className={styles.search}
          placeholder="输入反馈内容、作者信息搜索"
          loading={props.loading}
          value={props.keyword}
          onChange={(event) => props.onKeywordChange(event.target.value)}
          allowClear={true}
          onSearch={(_, __, info) => {
            if (info?.source === 'input') {
              props.onKeywordSearch()
            }
          }}
        />
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={props.loading}
          onClick={props.onResetRefresh}
        >
          <span>
            <Trans i18nKey="common.list.filter.reset_and_refresh" />
          </span>
        </Button>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
