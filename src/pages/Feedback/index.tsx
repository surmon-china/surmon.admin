/**
 * @file Feedback list page
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
  useComputed
} from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Input, Select, Divider, Modal, Space } from 'antd'
import * as Icon from '@ant-design/icons'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { SortSelect } from '@/components/common/SortSelect'
import { getFeedbacks, GetFeedbacksParams, deleteFeedbacks, putFeedback } from '@/store/feedback'
import { ResponsePaginationData } from '@/constants/request'
import { SortTypeBase } from '@/constants/sort'
import { Feedback, markedStates } from '@/constants/feedback'
import { scrollTo } from '@/services/scroller'
import { EditDrawer } from './EditDrawer'
import { FeedbackListTable } from './Table'

import styles from './style.module.less'

const ALL_VALUE = 'ALL'
const DEFAULT_FILTER_PARAMS = Object.freeze({
  tid: ALL_VALUE as number | typeof ALL_VALUE,
  emotion: ALL_VALUE as number | typeof ALL_VALUE,
  marked: ALL_VALUE as 0 | 1 | typeof ALL_VALUE,
  sort: SortTypeBase.Desc
})

export const FeedbackPage: React.FC = () => {
  const loading = useLoading()
  const submitting = useLoading()
  const feedbacks = useShallowReactive<ResponsePaginationData<Feedback>>({
    data: [],
    pagination: undefined
  })

  // 过滤参数
  const serarchKeyword = useRef('')
  const filterParams = useReactive({
    ...DEFAULT_FILTER_PARAMS,
    tid: DEFAULT_FILTER_PARAMS.tid
  })
  const updateTargetID = (postId: number | string) => {
    filterParams.tid = Number(postId)
  }

  // 多选
  const selectedIds = useRef<Array<string>>([])
  const selectFeedbacks = useComputed(() =>
    feedbacks.data.filter((c) => selectedIds.value.includes(c._id!))
  )
  const handleSelect = (ids: any[]) => {
    selectedIds.value = ids
  }

  // 编辑
  const activeEditDataIndex = useRef<number | null>(null)
  const isVisibleModal = useRef(false)
  const activeEditData = useComputed(() => {
    const index = activeEditDataIndex.value
    return index !== null ? feedbacks.data[index] : null
  })
  const closeModal = () => {
    isVisibleModal.value = false
  }
  const editData = (index: number) => {
    activeEditDataIndex.value = index
    isVisibleModal.value = true
  }

  const fetchData = (params?: GetFeedbacksParams) => {
    const getParams = {
      ...params,
      sort: filterParams.sort,
      tid: filterParams.tid !== ALL_VALUE ? filterParams.tid : undefined,
      emotion: filterParams.emotion !== ALL_VALUE ? filterParams.emotion : undefined,
      marked: filterParams.marked !== ALL_VALUE ? filterParams.marked : undefined,
      keyword: Boolean(serarchKeyword.value) ? serarchKeyword.value : undefined
    }

    loading.promise(getFeedbacks(getParams)).then((response) => {
      feedbacks.data = response.data
      feedbacks.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const resetParamsAndRefresh = () => {
    serarchKeyword.value = ''
    if (_.isEqual(toRaw(filterParams), DEFAULT_FILTER_PARAMS)) {
      fetchData()
    } else {
      batchedUpdates(() => {
        filterParams.tid = DEFAULT_FILTER_PARAMS.tid
        filterParams.emotion = DEFAULT_FILTER_PARAMS.emotion
        filterParams.marked = DEFAULT_FILTER_PARAMS.marked
        filterParams.sort = DEFAULT_FILTER_PARAMS.sort
      })
    }
  }

  const refreshData = () => {
    fetchData({
      page: feedbacks.pagination?.current_page,
      per_page: feedbacks.pagination?.per_page
    })
  }

  const handleDelete = (feedbacks: Array<Feedback>) => {
    Modal.confirm({
      title: `确定要彻底删除 ${feedbacks.length} 个反馈吗？`,
      content: '该行为是物理删除，不可恢复！',
      centered: true,
      onOk: () =>
        deleteFeedbacks(feedbacks.map((c) => c._id!)).then(() => {
          refreshData()
        })
    })
  }

  const handleSubmit = (feedback: Feedback) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { emotion_emoji, emotion_text, ...target } = {
      ...activeEditData.value,
      ...feedback
    }

    submitting
      .promise(
        putFeedback({
          ...target,
          ip: target.ip || null
        })
      )
      .then(() => {
        closeModal()
        refreshData()
      })
  }

  useWatch(filterParams, () => fetchData())

  onMounted(() => {
    fetchData()
  })

  return (
    <Card
      title={`反馈列表（${feedbacks.pagination?.total ?? '-'}）`}
      bordered={false}
      className={styles.feedback}
    >
      <Space className={styles.toolbar} align="center" wrap>
        <Space wrap>
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.tid}
            onChange={(postId) => {
              filterParams.tid = postId
            }}
            options={[
              {
                value: ALL_VALUE,
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
                    onSearch={updateTargetID}
                  />
                </div>
              </div>
            )}
          />
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.emotion}
            onChange={(emotion) => {
              filterParams.emotion = emotion
            }}
            options={[
              { value: ALL_VALUE, label: '所有评分' },
              { value: 1, label: '1 分' },
              { value: 2, label: '2 分' },
              { value: 3, label: '3 分' },
              { value: 4, label: '4 分' },
              { value: 5, label: '5 分' }
            ]}
          />
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.marked}
            onChange={(marked) => {
              filterParams.marked = marked
            }}
            options={[
              { value: ALL_VALUE, label: '标记状态' },
              ...markedStates.map((state) => ({
                value: state.number,
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
            loading={loading.state.value}
            value={filterParams.sort}
            onChange={(sort) => {
              filterParams.sort = sort
            }}
          />
          <Input.Search
            className={styles.search}
            placeholder="输入反馈内容、作者信息搜索"
            loading={loading.state.value}
            onSearch={() => fetchData()}
            value={serarchKeyword.value}
            onChange={(event) => {
              serarchKeyword.value = event.target.value
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
                onClick: () => handleDelete(selectFeedbacks.value)
              }
            ]}
          >
            批量操作
          </DropdownMenu>
        </Space>
      </Space>
      <Divider />
      <FeedbackListTable
        loading={loading.state.value}
        selectedIds={selectedIds.value}
        onSelecte={handleSelect}
        data={feedbacks.data}
        pagination={feedbacks.pagination!}
        onTargetID={updateTargetID}
        onDetail={(_, index) => editData(index)}
        onDelete={(feedback) => handleDelete([feedback])}
        onPagination={(page, pageSize) => fetchData({ page, per_page: pageSize })}
      />
      <EditDrawer
        loading={submitting.state.value}
        visible={isVisibleModal}
        feedback={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  )
}
