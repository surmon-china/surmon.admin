import React from 'react'
import * as Icons from '@ant-design/icons'
import { Button, Flex, Select, Input, Space } from 'antd'
import { DisqusPostState, DisqusOrderType } from '@/constants/disqus'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = {
  order: DisqusOrderType.Desc,
  include: SELECT_ALL_VALUE as any as DisqusPostState | typeof SELECT_ALL_VALUE
}

export type FilterParams = typeof DEFAULT_FILTER_PARAMS

export interface ListFiltersProps {
  loading: boolean
  params: FilterParams
  threadId: string
  onParamsChange(value: Partial<FilterParams>): void
  onThreadIdChange(targetId: string): void
  onThreadIdSearch(): void
  onResetRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  return (
    <Flex justify="space-between" gap="middle" wrap>
      <Space wrap>
        <Select
          style={{ width: 120 }}
          disabled={props.loading}
          value={props.params.include}
          onChange={(include) => props.onParamsChange({ include })}
          options={[
            {
              value: SELECT_ALL_VALUE,
              label: 'All state'
            },
            {
              value: DisqusPostState.Approved,
              label: 'Approved'
            },
            {
              value: DisqusPostState.Unapproved,
              label: 'Unapproved'
            },
            {
              value: DisqusPostState.Spam,
              label: 'Spam'
            },
            {
              value: DisqusPostState.Deleted,
              label: 'Deleted'
            },
            {
              value: DisqusPostState.Flagged,
              label: 'Flagged'
            },
            {
              value: DisqusPostState.Highlighted,
              label: 'Highlighted'
            }
          ]}
        />
        <Select
          style={{ width: 80 }}
          disabled={props.loading}
          value={props.params.order}
          onChange={(order) => props.onParamsChange({ order })}
          options={[
            {
              value: DisqusOrderType.Desc,
              label: 'Desc'
            },
            {
              value: DisqusOrderType.Asc,
              label: 'Asc'
            }
          ]}
        />
        <Input.Search
          style={{ width: 180 }}
          allowClear={true}
          placeholder="thread ID"
          disabled={props.loading}
          value={props.threadId}
          onChange={(event) => props.onThreadIdChange(event.target.value.trim())}
          onSearch={(_, __, info) => {
            if (info?.source === 'input') {
              props.onThreadIdSearch()
            }
          }}
        />
        <Button
          loading={props.loading}
          icon={<Icons.ReloadOutlined />}
          onClick={() => props.onResetRefresh()}
        >
          Reset and refresh
        </Button>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
