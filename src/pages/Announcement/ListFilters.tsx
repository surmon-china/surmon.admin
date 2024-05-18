import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { SortSelect } from '@/components/common/SortSelect'
import { SortTypeBase } from '@/constants/sort'
import { AnnouncementState, announcementStates } from '@/constants/announcement'

import styles from './style.module.less'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = {
  state: SELECT_ALL_VALUE as typeof SELECT_ALL_VALUE | AnnouncementState,
  sort: SortTypeBase.Desc
}

export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  state: params.state !== SELECT_ALL_VALUE ? params.state : void 0,
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
  const { i18n } = useTranslation()
  return (
    <Flex justify="space-between" gap="middle" wrap className={styles.listFilters}>
      <Space wrap>
        <Select
          className={styles.select}
          loading={props.loading}
          value={props.params.state}
          onChange={(state) => props.onParamsChange({ state })}
          options={[
            { label: '全部状态', value: SELECT_ALL_VALUE },
            ...announcementStates.map((state) => ({
              value: state.id,
              label: (
                <Space>
                  {state.icon}
                  {state.name}
                </Space>
              )
            }))
          ]}
        />
        <SortSelect
          loading={props.loading}
          value={props.params.sort}
          onChange={(sort) => props.onParamsChange({ sort })}
        />
        <Input.Search
          className={styles.search}
          placeholder={i18n.t('common.list.filter.search')}
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
          onClick={() => props.onResetRefresh()}
        >
          {i18n.t('common.list.filter.refresh_with_reset')}
        </Button>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
