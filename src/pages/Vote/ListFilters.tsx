import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { Trans } from '@/i18n'
import { SortTypeBase } from '@/constants/sort'
import { SortSelect } from '@/components/common/SortSelect'
import { VoteTarget, VoteType, VoteAuthorType, voteTypes } from '@/constants/vote'
import { getVoteTargetText, getVoteAuthorTypeText } from '@/constants/vote'

import styles from './style.module.less'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_TARGET_ID = void 0
export const DEFAULT_FILTER_PARAMS = {
  target_type: SELECT_ALL_VALUE as VoteTarget | typeof SELECT_ALL_VALUE,
  vote_type: SELECT_ALL_VALUE as VoteType | typeof SELECT_ALL_VALUE,
  author_type: SELECT_ALL_VALUE as VoteAuthorType | typeof SELECT_ALL_VALUE,
  sort: SortTypeBase.Desc
}

export type FilterTargetId = number | typeof DEFAULT_TARGET_ID
export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  target_type: params.target_type !== SELECT_ALL_VALUE ? params.target_type : void 0,
  vote_type: params.vote_type !== SELECT_ALL_VALUE ? params.vote_type : void 0,
  author_type: params.author_type !== SELECT_ALL_VALUE ? params.author_type : void 0,
  sort: params.sort
})

export interface ListFiltersProps {
  loading: boolean
  params: FilterParams
  targetId: FilterTargetId
  onParamsChange(value: Partial<FilterParams>): void
  onTargetIdChange(targetId: FilterTargetId): void
  onTargetIdSearch(): void
  onRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  return (
    <Flex justify="space-between" gap="middle" wrap className={styles.listFilters}>
      <Space wrap>
        <Space.Compact>
          <Select
            className={styles.select}
            loading={props.loading}
            value={props.params.target_type}
            onChange={(target_type) => props.onParamsChange({ target_type })}
            options={[
              { value: SELECT_ALL_VALUE, label: '所有类型' },
              { value: VoteTarget.Post, label: getVoteTargetText(VoteTarget.Post) },
              { value: VoteTarget.Comment, label: getVoteTargetText(VoteTarget.Comment) }
            ]}
          />
          <Input.Search
            className={styles.targetIdInput}
            value={props.targetId}
            placeholder="目标 ID"
            type="number"
            min={0}
            step={1}
            allowClear={true}
            onSearch={(_, __, info) => {
              if (info?.source === 'input') {
                props.onTargetIdSearch()
              }
            }}
            onChange={(event) => {
              const value = event.target.value
              if (value && Number.isFinite(Number(value))) {
                props.onTargetIdChange(Number(value))
              } else {
                props.onTargetIdChange(void 0)
              }
            }}
          />
        </Space.Compact>
        <Select
          className={styles.select}
          loading={props.loading}
          value={props.params.vote_type}
          onChange={(vote_type) => props.onParamsChange({ vote_type })}
          options={[
            { value: SELECT_ALL_VALUE, label: '所有态度' },
            ...voteTypes.map((type) => ({
              value: type.id,
              label: (
                <Space>
                  {type.icon}
                  {type.name}
                </Space>
              )
            }))
          ]}
        />
        <Select
          className={styles.select}
          loading={props.loading}
          value={props.params.author_type}
          onChange={(author_type) => props.onParamsChange({ author_type })}
          options={[
            { value: SELECT_ALL_VALUE, label: '所有用户' },
            ...[VoteAuthorType.Anonymous, VoteAuthorType.Guest, VoteAuthorType.Disqus].map(
              (type) => ({
                value: type,
                label: getVoteAuthorTypeText(type)
              })
            )
          ]}
        />
        <SortSelect
          loading={props.loading}
          value={props.params.sort}
          onChange={(sort) => props.onParamsChange({ sort })}
        />
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={props.loading}
          onClick={() => props.onRefresh()}
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
