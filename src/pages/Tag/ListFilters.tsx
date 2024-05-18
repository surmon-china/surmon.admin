import React from 'react'
import { Button, Input, Space, Flex } from 'antd'
import * as Icon from '@ant-design/icons'
import { useTranslation } from '@/i18n'

export interface ListFiltersProps {
  loading: boolean
  keyword: string
  onKeywordChange(keyword: string): void
  onKeywordSearch(): void
  onRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  const { i18n } = useTranslation()
  return (
    <Flex justify="space-between" gap="middle" wrap>
      <Space wrap>
        <Input.Search
          style={{ width: 220 }}
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
        <Button icon={<Icon.ReloadOutlined />} loading={props.loading} onClick={props.onRefresh}>
          {i18n.t('common.list.filter.reset_and_refresh')}
        </Button>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
