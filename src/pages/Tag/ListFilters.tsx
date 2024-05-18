import React from 'react'
import { Button, Input, Space, Flex } from 'antd'
import * as Icon from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { DropdownMenu } from '@/components/common/DropdownMenu'

export interface ListFiltersProps {
  loading: boolean
  keyword: string
  disabledBatchActions?: boolean
  onKeywordChange(keyword: string): void
  onKeywordSearch(): void
  onRefresh(): void
  onBatchDelete(): void
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
          onSearch={() => props.onKeywordSearch()}
        />
        <Button icon={<Icon.ReloadOutlined />} loading={props.loading} onClick={props.onRefresh}>
          {i18n.t('common.list.filter.reset_and_refresh')}
        </Button>
      </Space>
      <Space>
        <DropdownMenu
          text="批量操作"
          disabled={props.disabledBatchActions}
          options={[
            {
              label: '批量删除',
              icon: <Icon.DeleteOutlined />,
              onClick: () => props.onBatchDelete()
            }
          ]}
        />
      </Space>
    </Flex>
  )
}
