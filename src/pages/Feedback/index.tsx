/**
 * @file Feedback list page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { isEqual } from 'lodash'
import { useShallowReactive, useRef, onMounted, useWatch, toRaw, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { useTranslation } from '@/i18n'
import { Card, Divider, Modal } from 'antd'
import { ResponsePaginationData } from '@/constants/nodepress'
import { Feedback } from '@/constants/feedback'
import { scrollTo } from '@/services/scroller'
import type { GetFeedbacksParams } from '@/apis/feedback'
import * as api from '@/apis/feedback'
import { ListFilters, DEFAULT_FILTER_PARAMS, getQueryParams, FilterParams } from './ListFilters'
import { TableList } from './TableList'
import { EditDrawer } from './EditDrawer'

import styles from './style.module.less'

export const FeedbackPage: React.FC = () => {
  const { i18n } = useTranslation()
  const loading = useLoading()
  const updating = useLoading()
  const feedbacks = useShallowReactive<ResponsePaginationData<Feedback>>({
    data: [],
    pagination: undefined
  })

  // filters
  const filterKeyword = useRef('')
  const filterParams = useRef<FilterParams>({ ...DEFAULT_FILTER_PARAMS })

  // select
  const selectedIds = useRef<Array<string>>([])
  const selectedFeedbacks = useComputed(() => {
    return feedbacks.data.filter((c) => selectedIds.value.includes(c._id!))
  })

  // edit modal
  const activeEditItemIndex = useRef<number | null>(null)
  const isVisibleModal = useRef(false)
  const activeEditItem = useComputed(() => {
    const index = activeEditItemIndex.value
    return index !== null ? feedbacks.data[index] : null
  })

  const closeEditModal = () => {
    isVisibleModal.value = false
  }

  const openEditModal = (index: number) => {
    activeEditItemIndex.value = index
    isVisibleModal.value = true
  }

  const fetchList = (params?: GetFeedbacksParams) => {
    const getParams = {
      ...params,
      ...getQueryParams(filterParams.value),
      keyword: filterKeyword.value || void 0
    }

    loading.promise(api.getFeedbacks(getParams)).then((response) => {
      feedbacks.data = response.data
      feedbacks.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const refreshList = () => {
    fetchList({
      page: feedbacks.pagination?.current_page,
      per_page: feedbacks.pagination?.per_page
    })
  }

  const deleteItems = (feedbacks: Array<Feedback>) => {
    Modal.confirm({
      title: `确定要彻底删除 ${feedbacks.length} 个反馈吗？`,
      content: '该行为是物理删除，不可恢复！',
      centered: true,
      onOk() {
        return api.deleteFeedbacks(feedbacks.map((c) => c._id!)).then(() => {
          refreshList()
        })
      }
    })
  }

  const updateItem = (feedback: Feedback) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { emotion_emoji, emotion_text, ...target } = {
      ...activeEditItem.value,
      ...feedback
    }

    updating
      .promise(
        api.putFeedback({
          ...target,
          ip: target.ip || null
        })
      )
      .then(() => {
        closeEditModal()
        refreshList()
      })
  }

  const resetParamsAndRefresh = () => {
    filterKeyword.value = ''
    if (isEqual(toRaw(filterParams), DEFAULT_FILTER_PARAMS)) {
      fetchList()
    } else {
      filterParams.value = { ...DEFAULT_FILTER_PARAMS }
    }
  }

  useWatch(
    () => filterParams.value,
    () => fetchList(),
    { deep: true }
  )

  onMounted(() => {
    fetchList()
  })

  return (
    <Card
      bordered={false}
      className={styles.feedback}
      title={i18n.t('page.feedback.list.title', { total: feedbacks.pagination?.total ?? '-' })}
    >
      <ListFilters
        loading={loading.state.value}
        disabledBatchActions={!selectedIds.value.length}
        keyword={filterKeyword.value}
        params={filterParams.value}
        onKeywordSearch={() => fetchList()}
        onRefresh={resetParamsAndRefresh}
        onBatchDelete={() => deleteItems(selectedFeedbacks.value)}
        onKeywordChange={(keyword) => {
          filterKeyword.value = keyword
        }}
        onParamsChange={(value) => {
          Object.assign(filterParams.value, value)
        }}
      />
      <Divider />
      <TableList
        loading={loading.state.value}
        selectedIds={selectedIds.value}
        onSelect={(ids) => {
          selectedIds.value = ids
        }}
        data={feedbacks.data}
        pagination={feedbacks.pagination!}
        onDetail={(_, index) => openEditModal(index)}
        onDelete={(feedback) => deleteItems([feedback])}
        onPagination={(page, pageSize) => fetchList({ page, per_page: pageSize })}
      />
      <EditDrawer
        loading={updating.state.value}
        visible={isVisibleModal}
        feedback={activeEditItem}
        onCancel={closeEditModal}
        onSubmit={updateItem}
      />
    </Card>
  )
}
