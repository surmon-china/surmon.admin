/**
 * @file Comment page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import queryString from 'query-string'
import { uniq } from 'lodash'
import { useLocation } from 'react-router-dom'
import { useShallowReactive, useRef, onMounted, useWatch, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Card, Divider, Modal, Drawer, Spin } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/comment'
import type { GetCommentsParams } from '@/apis/comment'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { Comment as CommentType, CommentState, getCommentState } from '@/constants/comment'
import { ResponsePaginationData } from '@/constants/nodepress'
import { scrollTo } from '@/services/scroller'
import { useTranslation } from '@/i18n'
import { ListFilters, DEFAULT_FILTER_PARAMS, getQueryParams } from './ListFilters'
import { ExtraActions } from './ExtraActions'
import { TableList } from './TableList'
import { EditForm } from './EditForm'

export const CommentPage: React.FC = () => {
  const location = useLocation()
  const { i18n } = useTranslation()
  const { post_id } = queryString.parse(location.search)
  const postIdParam = post_id ? Number(post_id) : void 0

  // comments
  const fetching = useLoading()
  const updating = useLoading()
  const comments = useShallowReactive<ResponsePaginationData<CommentType>>({
    data: [],
    pagination: void 0
  })

  // filters
  const searchKeyword = useRef('')
  const filterPostIdInput = useRef(String(postIdParam ?? ''))
  const filterParams = useRef({
    ...DEFAULT_FILTER_PARAMS,
    postId: postIdParam ?? DEFAULT_FILTER_PARAMS.postId
  })

  const resetFiltersToDefault = () => {
    searchKeyword.value = ''
    filterPostIdInput.value = ''
    filterParams.value = { ...DEFAULT_FILTER_PARAMS }
  }

  const resetFiltersToPostId = (postId: number) => {
    searchKeyword.value = ''
    filterPostIdInput.value = String(postId)
    filterParams.value = {
      ...DEFAULT_FILTER_PARAMS,
      postId: Number(postId)
    }
  }

  // select
  const selectedIds = useRef<string[]>([])
  const selectedComments = useComputed(() => {
    return comments.data.filter((comment) => selectedIds.value.includes(comment._id!))
  })

  // drawer
  const isEditDrawerOpen = useRef(false)
  const activeEditCommentIndex = useRef<number | null>(null)
  const activeEditComment = useComputed(() => {
    const index = activeEditCommentIndex.value
    return index !== null ? comments.data[index] : null
  })

  const closeEditDrawer = () => {
    isEditDrawerOpen.value = false
  }

  const openEditDrawer = (index: number) => {
    activeEditCommentIndex.value = index
    isEditDrawerOpen.value = true
  }

  const fetchList = (params?: GetCommentsParams) => {
    const getParams = {
      ...params,
      ...getQueryParams(filterParams.value),
      keyword: searchKeyword.value || void 0
    }

    fetching.promise(api.getComments(getParams)).then((response) => {
      comments.data = response.data
      comments.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const refreshList = () => {
    fetchList({
      page: comments.pagination?.current_page,
      per_page: comments.pagination?.per_page
    })
  }

  const updateComment = (comment: CommentType) => {
    const payload = {
      ...activeEditComment.value,
      ...comment
    }

    updating.promise(api.updateComment(payload)).then(() => {
      closeEditDrawer()
      refreshList()
    })
  }

  const deleteComments = (comments: CommentType[]) => {
    Modal.confirm({
      title: `确定要彻底删除 ${comments.length} 个评论吗？`,
      content: '该行为是物理删除，不可恢复！',
      centered: true,
      onOk: () => {
        return api
          .deleteComments(
            comments.map((comment) => comment._id!),
            uniq(comments.map((comment) => comment.post_id))
          )
          .then(() => {
            refreshList()
          })
      }
    })
  }

  const updateCommentsState = (comments: CommentType[], state: CommentState) => {
    Modal.confirm({
      title: `确定要将 ${comments.length} 个评论更新为「 ${getCommentState(state).name} 」状态吗？`,
      content: '操作不可撤销',
      centered: true,
      onOk: () => {
        return api
          .patchCommentsState(
            comments.map((comment) => comment._id!),
            uniq(comments.map((comment) => comment.post_id)),
            state
          )
          .then(() => {
            refreshList()
          })
      }
    })
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
      title={i18n.t('page.comment.list.title', { total: comments.pagination?.total ?? '-' })}
      extra={<ExtraActions comments={comments.data} loading={fetching.state.value} />}
    >
      <ListFilters
        loading={fetching.state.value}
        keyword={searchKeyword.value}
        onKeywordChange={(value) => (searchKeyword.value = value)}
        onKeywordSearch={() => fetchList()}
        params={filterParams.value}
        onParamsChange={(value) => Object.assign(filterParams.value, value)}
        postIdInput={filterPostIdInput.value}
        onPostIdInputChange={(value) => (filterPostIdInput.value = value)}
        onResetRefresh={resetFiltersToDefault}
        extra={
          <DropdownMenu
            text="批量操作"
            disabled={!selectedIds.value.length}
            options={[
              {
                label: '退为草稿',
                icon: <Icons.EditOutlined />,
                onClick: () => updateCommentsState(selectedComments.value, CommentState.Auditing)
              },
              {
                label: '审核通过',
                icon: <Icons.CheckOutlined />,
                onClick: () => updateCommentsState(selectedComments.value, CommentState.Published)
              },
              {
                label: '标为垃圾',
                icon: <Icons.StopOutlined />,
                onClick: () => updateCommentsState(selectedComments.value, CommentState.Spam)
              },
              {
                label: '移回收站',
                icon: <Icons.DeleteOutlined />,
                onClick: () => updateCommentsState(selectedComments.value, CommentState.Deleted)
              },
              {
                label: '彻底删除',
                icon: <Icons.DeleteOutlined />,
                onClick: () => deleteComments(selectedComments.value)
              }
            ]}
          />
        }
      />
      <Divider />
      <TableList
        loading={fetching.state.value}
        selectedIds={selectedIds.value}
        onSelecte={(ids) => (selectedIds.value = ids)}
        data={comments.data}
        pagination={comments.pagination}
        onPaginate={(page, pageSize) => fetchList({ page, per_page: pageSize })}
        onDetail={(_, index) => openEditDrawer(index)}
        onDelete={(comment) => deleteComments([comment])}
        onUpdateState={(comment, state) => updateCommentsState([comment], state)}
        onClickPostId={resetFiltersToPostId}
      />
      <Drawer
        width="46rem"
        title="评论详情"
        destroyOnClose={true}
        open={isEditDrawerOpen.value}
        onClose={closeEditDrawer}
      >
        <Spin spinning={updating.state.value}>
          {activeEditComment.value && (
            <EditForm
              submitting={updating.state.value}
              comment={activeEditComment.value}
              onSubmit={(comment) => updateComment(comment)}
            />
          )}
        </Spin>
      </Drawer>
    </Card>
  )
}
