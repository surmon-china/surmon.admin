/**
 * @file Vote list page
 * @author Surmon <https://github.com/surmon-china>
 */

import _ from 'lodash'
import React from 'react'
import {
  useShallowReactive,
  useRef,
  onMounted,
  useReactive,
  useWatch,
  toRaw,
  batchedUpdates,
  useComputed,
} from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Input, Select, Divider, Modal, Space } from 'antd'
import * as Icon from '@ant-design/icons'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { SortSelect } from '@/components/common/SortSelect'
import { GetVotesParams, getVotes, deleteVotes } from '@/store/vote'
import { ResponsePaginationData } from '@/constants/request'
import { SortTypeBase } from '@/constants/sort'
import {
  Vote,
  VoteTarget,
  VoteType,
  VoteAuthorType,
  voteTypes,
  getVoteTargetText,
  getVoteAuthorTypeText,
} from '@/constants/vote'
import { scrollTo } from '@/services/scroller'
import { VoteListTable } from './Table'

import styles from './style.module.less'

const ALL_VALUE = 'ALL'
const DEFAULT_FILTER_PARAMS = Object.freeze({
  target_id: void 0 as number | undefined,
  target_type: ALL_VALUE as VoteTarget | typeof ALL_VALUE,
  vote_type: ALL_VALUE as VoteType | typeof ALL_VALUE,
  author_type: ALL_VALUE as VoteAuthorType | typeof ALL_VALUE,
  sort: SortTypeBase.Desc,
})

export const VotePage: React.FC = () => {
  const loading = useLoading()
  const votes = useShallowReactive<ResponsePaginationData<Vote>>({
    data: [],
    pagination: void 0,
  })

  const filterParams = useReactive({ ...DEFAULT_FILTER_PARAMS })
  const updateTargetID = (targetId: number | void | undefined) => {
    filterParams.target_id = Number.isFinite(targetId) ? (targetId as number) : undefined
  }

  // 多选
  const selectedIds = useRef<Array<string>>([])
  const selectVotes = useComputed(() =>
    votes.data.filter((c) => selectedIds.value.includes(c._id!))
  )
  const handleSelect = (ids: any[]) => {
    selectedIds.value = ids
  }

  const fetchData = (params?: GetVotesParams) => {
    const getParams: GetVotesParams = {
      ...params,
      sort: filterParams.sort,
      target_id: filterParams.target_id,
      target_type: filterParams.target_type !== ALL_VALUE ? filterParams.target_type : void 0,
      vote_type: filterParams.vote_type !== ALL_VALUE ? filterParams.vote_type : void 0,
      author_type: filterParams.author_type !== ALL_VALUE ? filterParams.author_type : void 0,
    }

    loading.promise(getVotes(getParams)).then((response) => {
      votes.data = response.data
      votes.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const resetParamsAndRefresh = () => {
    if (_.isEqual(toRaw(filterParams), DEFAULT_FILTER_PARAMS)) {
      fetchData()
    } else {
      batchedUpdates(() => {
        filterParams.target_type = DEFAULT_FILTER_PARAMS.target_type
        filterParams.target_id = DEFAULT_FILTER_PARAMS.target_id
        filterParams.vote_type = DEFAULT_FILTER_PARAMS.vote_type
        filterParams.author_type = DEFAULT_FILTER_PARAMS.author_type
      })
    }
  }

  const refreshData = () => {
    fetchData({
      page: votes.pagination?.current_page,
      per_page: votes.pagination?.per_page,
    })
  }

  const handleDelete = (votes: Array<Vote>) => {
    Modal.confirm({
      title: `确定要彻底删除 ${votes.length} 个记录吗？`,
      content: '该行为是物理删除，不可恢复！',
      centered: true,
      onOk: () =>
        deleteVotes(votes.map((c) => c._id!)).then(() => {
          refreshData()
        }),
    })
  }

  useWatch(filterParams, () => fetchData())

  onMounted(() => {
    fetchData()
  })

  return (
    <Card
      title={`用户表态记录（${votes.pagination?.total ?? '-'}）`}
      bordered={false}
      className={styles.vote}
    >
      <Space align="center" className={styles.toolbar}>
        <Space>
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.target_type}
            onChange={(type) => {
              filterParams.target_type = type
            }}
            options={[
              { value: ALL_VALUE, label: '所有目标' },
              ...[VoteTarget.Site, VoteTarget.Article, VoteTarget.Comment].map((target) => ({
                value: target,
                label: getVoteTargetText(target),
              })),
            ]}
          />
          <Input.Group compact>
            <Button onClick={() => updateTargetID(void 0)}>All</Button>
            <Input.Search
              className={styles.targetIdInput}
              placeholder="目标 ID"
              type="number"
              min={0}
              step={1}
              value={filterParams.target_id}
              onSearch={(targetInput) => {
                const targetId = targetInput !== '' && Number(targetInput)
                Number.isFinite(targetId)
                  ? updateTargetID(targetId as number)
                  : updateTargetID(void 0)
              }}
            />
          </Input.Group>
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.vote_type}
            onChange={(type) => {
              filterParams.vote_type = type
            }}
            options={[
              { value: ALL_VALUE, label: '所有态度' },
              ...voteTypes.map((type) => ({
                value: type.id,
                label: (
                  <Space>
                    {type.icon}
                    {type.name}
                  </Space>
                ),
              })),
            ]}
          />
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.author_type}
            onChange={(type) => {
              filterParams.author_type = type
            }}
            options={[
              { value: ALL_VALUE, label: '所有用户' },
              ...[VoteAuthorType.Anonymous, VoteAuthorType.Guest, VoteAuthorType.Disqus].map(
                (type) => ({
                  value: type,
                  label: getVoteAuthorTypeText(type),
                })
              ),
            ]}
          />
          <SortSelect
            loading={loading.state.value}
            value={filterParams.sort}
            onChange={(sort) => {
              filterParams.sort = sort
            }}
          />
          <Button
            icon={<Icon.ReloadOutlined />}
            loading={loading.state.value}
            onClick={() => resetParamsAndRefresh()}
          >
            重置并刷新
          </Button>
        </Space>
        <Space>
          <DropdownMenu
            disabled={!selectedIds.value.length}
            options={[
              {
                label: '彻底删除',
                icon: <Icon.DeleteOutlined />,
                onClick: () => handleDelete(selectVotes.value),
              },
            ]}
          >
            批量操作
          </DropdownMenu>
        </Space>
      </Space>
      <Divider />
      <VoteListTable
        loading={loading.state.value}
        selectedIds={selectedIds.value}
        data={votes.data}
        pagination={votes.pagination!}
        onSelecte={handleSelect}
        onTargetID={updateTargetID}
        onPagination={(page, pageSize) => fetchData({ page, per_page: pageSize })}
      />
    </Card>
  )
}
