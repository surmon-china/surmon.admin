import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icon from '@ant-design/icons'
import { Trans } from '@/i18n'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { SortSelect } from '@/components/common/SortSelect'
import { SortTypeBase } from '@/constants/sort'
import { MarkedState } from '@/constants/feedback'

import styles from './style.module.less'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = {
  tid: SELECT_ALL_VALUE as number | typeof SELECT_ALL_VALUE,
  emotion: SELECT_ALL_VALUE as number | typeof SELECT_ALL_VALUE,
  marked: SELECT_ALL_VALUE as MarkedState | typeof SELECT_ALL_VALUE,
  sort: SortTypeBase.Desc
}

export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  tid: params.tid !== SELECT_ALL_VALUE ? params.tid : void 0,
  emotion: params.emotion !== SELECT_ALL_VALUE ? params.emotion : void 0,
  marked: params.marked !== SELECT_ALL_VALUE ? params.marked : void 0,
  sort: params.sort
})

export interface ListFiltersProps {
  loading: boolean
  keyword: string
  params: FilterParams
  disabledBatchActions?: boolean
  onParamsChange(value: Partial<FilterParams>): void
  onKeywordChange(keyword: string): void
  onKeywordSearch(): void
  onRefresh(): void
  onBatchDelete(): void
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  return (
    <Flex justify="space-between" gap="middle" wrap className={styles.listFilters}>
      <Space wrap>
        <Button
          loading={props.loading}
          type={props.params.marked === MarkedState.Yes ? 'primary' : 'default'}
          icon={
            props.params.marked === MarkedState.Yes ? <Icon.StarFilled /> : <Icon.StarOutlined />
          }
          onClick={() => {
            props.onParamsChange({
              marked: props.params.marked === MarkedState.Yes ? SELECT_ALL_VALUE : MarkedState.Yes
            })
          }}
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
          onSearch={() => props.onKeywordSearch()}
          value={props.keyword}
          onChange={(event) => props.onKeywordChange(event.target.value)}
        />
        <Button icon={<Icon.ReloadOutlined />} loading={props.loading} onClick={props.onRefresh}>
          <span>
            <Trans i18nKey="common.list.filter.reset_and_refresh" />
          </span>
        </Button>
      </Space>
      <Space>
        <DropdownMenu
          text="批量操作"
          disabled={props.disabledBatchActions}
          options={[
            {
              label: '彻底删除',
              icon: <Icon.DeleteOutlined />,
              onClick: props.onBatchDelete
            }
          ]}
        />
      </Space>
    </Flex>
  )
}
