import React from 'react'
import { Button, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { Trans } from '@/i18n'
import { SortTypeBase } from '@/constants/sort'
import { SortSelect } from '@/components/common/SortSelect'
import { SelectWithInput } from '@/components/common/SelectWithInput'
import { VoteTarget, VoteType, VoteAuthorType, voteTypes } from '@/constants/vote'
import { getVoteTargetText, getVoteAuthorTypeText } from '@/constants/vote'

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
  onResetRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  return (
    <Flex justify="space-between" gap="middle" wrap>
      <Space wrap>
        <Space.Compact>
          <SelectWithInput
            loading={props.loading}
            inputStyle={{ width: 120 }}
            inputPlaceholder={
              (props.params.target_type === SELECT_ALL_VALUE
                ? '目标'
                : getVoteTargetText(props.params.target_type)) + ' ID'
            }
            inputType="number"
            inputValue={props.targetId}
            onInputSearch={() => props.onTargetIdSearch()}
            onInputChange={(value) => {
              if (value && Number.isFinite(Number(value))) {
                props.onTargetIdChange(Number(value))
              } else {
                props.onTargetIdChange(void 0)
              }
            }}
            selectStyle={{ width: 110 }}
            selectValue={props.params.target_type}
            onSelectChange={(target_type) => {
              props.onTargetIdChange(void 0)
              props.onParamsChange({ target_type })
            }}
            selectOptions={[
              { value: SELECT_ALL_VALUE, label: '所有类型' },
              { value: VoteTarget.Post, label: getVoteTargetText(VoteTarget.Post) },
              { value: VoteTarget.Comment, label: getVoteTargetText(VoteTarget.Comment) }
            ]}
          />
        </Space.Compact>
        <Select
          style={{ width: 110 }}
          loading={props.loading}
          value={props.params.vote_type}
          onChange={(vote_type) => props.onParamsChange({ vote_type })}
          options={[
            { value: SELECT_ALL_VALUE, label: '所有态度' },
            ...voteTypes.map((type) => ({
              value: type.id,
              label: (
                <Space size="small">
                  {type.icon}
                  {type.name}
                </Space>
              )
            }))
          ]}
        />
        <Select
          style={{ width: 120 }}
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
          style={{ width: 110 }}
          loading={props.loading}
          value={props.params.sort}
          onChange={(sort) => props.onParamsChange({ sort })}
        />
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={props.loading}
          onClick={() => props.onResetRefresh()}
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
