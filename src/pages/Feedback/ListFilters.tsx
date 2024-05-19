import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { Trans } from '@/i18n'
import { SortSelect } from '@/components/common/SortSelect'
import { SelectWithInput } from '@/components/common/SelectWithInput'
import { SortTypeBase } from '@/constants/sort'
import { MarkedState } from '@/constants/feedback'

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
    <Flex justify="space-between" gap="middle" wrap>
      <Space wrap>
        <Button
          disabled={props.loading}
          type={props.params.marked ? 'primary' : 'default'}
          icon={props.params.marked ? <Icons.StarFilled /> : <Icons.StarOutlined />}
          onClick={() => props.onParamsChange({ marked: !props.params.marked })}
        >
          标记数据
        </Button>
        <SelectWithInput
          disabled={props.loading}
          inputStyle={{ width: 100 }}
          inputPlaceholder="TID"
          inputType="number"
          onInputSearch={(value) => {
            const tid = value ? Number(value) : SELECT_ALL_VALUE
            props.onParamsChange({ tid })
          }}
          selectStyle={{ width: 110 }}
          selectValue={props.params.tid}
          onSelectChange={(tid) => props.onParamsChange({ tid })}
          selectOptions={[
            { value: SELECT_ALL_VALUE, label: '所有反馈' },
            { value: 0, label: '站点反馈' }
          ]}
        />
        <Select
          style={{ width: 110 }}
          disabled={props.loading}
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
          style={{ width: 110 }}
          disabled={props.loading}
          value={props.params.sort}
          onChange={(sort) => props.onParamsChange({ sort })}
        />
        <Input.Search
          style={{ width: 260 }}
          placeholder="输入反馈内容、作者信息搜索"
          disabled={props.loading}
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
            <Trans i18nKey="common.list.filter.refresh_with_reset" />
          </span>
        </Button>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
