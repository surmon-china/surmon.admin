/**
 * @file Comment list page
 * @author Surmon <https://github.com/surmon-china>
 */

import _ from 'lodash';
import classnames from 'classnames';
import React from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import {
  useShallowReactive,
  useRef,
  onMounted,
  useReactive,
  useWatch,
  toRaw,
  batchedUpdates,
  useComputed,
} from 'veact';
import { useLoading } from 'veact-use';
import { Button, Card, Input, Select, Divider, Modal, Space } from 'antd';
import {
  DeleteOutlined,
  StopOutlined,
  RocketOutlined,
  EditOutlined,
  CheckOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { DropdownMenu } from '@/components/common/DropdownMenu';
import {
  getComments,
  GetCommentsParams,
  deleteComments,
  putComment,
  updateCommentsState,
} from '@/store/comment';
import {
  Comment as CommentType,
  CommentState,
  commentStates,
  COMMENT_GUESTBOOK_ID,
  cs,
} from '@/constants/comment';
import { ResponsePaginationData } from '@/constants/request';
import { sortTypes, SortType } from '@/constants/sort';
import { scrollTo } from '@/services/scroller';
import { getFEGuestbookPath } from '@/transformers/url';
import { EditDrawer } from './EditDrawer';
import { CommentListTable } from './Table';

import styles from './style.module.less';

const LIST_ALL_VALUE = 'ALL';
const SELECT_ALL_VALUE = 'ALL';
const DEFAULT_FILTER_PARAMS = Object.freeze({
  postId: LIST_ALL_VALUE as number | typeof LIST_ALL_VALUE,
  state: SELECT_ALL_VALUE as typeof SELECT_ALL_VALUE | CommentState,
  sort: SortType.Desc,
});

export const CommentPage: React.FC = () => {
  // params
  const location = useLocation();
  const { post_id } = queryString.parse(location.search);
  const postIdParam = post_id ? Number(post_id) : undefined;

  // comments
  const loading = useLoading();
  const submitting = useLoading();
  const comment = useShallowReactive<ResponsePaginationData<CommentType>>({
    data: [],
    pagination: undefined,
  });

  // 过滤参数
  const serarchKeyword = useRef('');
  const filterParams = useReactive({
    ...DEFAULT_FILTER_PARAMS,
    postId: postIdParam || DEFAULT_FILTER_PARAMS.postId,
  });
  const updatePostId = (postId: number | string) => {
    filterParams.postId = Number(postId);
  };

  // 多选
  const selectedIds = useRef<Array<string>>([]);
  const selectComments = useComputed(() =>
    comment.data.filter((c) => selectedIds.value.includes(c._id!))
  );
  const handleSelect = (ids: any[]) => {
    selectedIds.value = ids;
  };

  // 编辑
  const activeEditDataIndex = useRef<number | null>(null);
  const isVisibleModal = useRef(false);
  const activeEditData = useComputed(() => {
    const index = activeEditDataIndex.value;
    return index !== null ? comment.data[index] : null;
  });
  const closeModal = () => {
    isVisibleModal.value = false;
  };
  const editData = (index: number) => {
    activeEditDataIndex.value = index;
    isVisibleModal.value = true;
  };

  const fetchData = (params?: GetCommentsParams) => {
    const getParams = {
      ...params,
      sort: filterParams.sort,
      post_id: filterParams.postId !== LIST_ALL_VALUE ? filterParams.postId : undefined,
      state: filterParams.state !== SELECT_ALL_VALUE ? filterParams.state : undefined,
      keyword: Boolean(serarchKeyword.value) ? serarchKeyword.value : undefined,
    };

    loading.promise(getComments(getParams)).then((response) => {
      comment.data = response.data;
      comment.pagination = response.pagination;
      scrollTo(document.body);
    });
  };

  const resetParamsAndRefresh = () => {
    serarchKeyword.value = '';
    if (_.isEqual(toRaw(filterParams), DEFAULT_FILTER_PARAMS)) {
      fetchData();
    } else {
      batchedUpdates(() => {
        filterParams.state = DEFAULT_FILTER_PARAMS.state;
        filterParams.sort = DEFAULT_FILTER_PARAMS.sort;
        filterParams.postId = DEFAULT_FILTER_PARAMS.postId;
      });
    }
  };

  const refreshData = () => {
    fetchData({
      page: comment.pagination?.current_page,
      per_page: comment.pagination?.per_page,
    });
  };

  const handleDelete = (comments: Array<CommentType>) => {
    Modal.confirm({
      title: `确定要彻底删除 ${comments.length} 个评论吗？`,
      content: '该行为是物理删除，不可恢复！',
      centered: true,
      onOk: () =>
        deleteComments(
          comments.map((c) => c._id!),
          _.uniq(comments.map((c) => c.post_id))
        ).then(() => {
          refreshData();
        }),
    });
  };

  const handleStateChange = (comments: Array<CommentType>, state: CommentState) => {
    Modal.confirm({
      title: `确定要将 ${comments.length} 个评论更新为「 ${cs(state).name} 」状态吗？`,
      content: '操作不可撤销',
      centered: true,
      onOk: () =>
        updateCommentsState(
          comments.map((c) => c._id!),
          _.uniq(comments.map((c) => c.post_id)),
          state
        ).then(() => {
          refreshData();
        }),
    });
  };

  const handleSubmit = (comment: CommentType) => {
    submitting
      .promise(
        putComment({
          ...activeEditData.value,
          ...comment,
        })
      )
      .then(() => {
        closeModal();
        refreshData();
      });
  };

  useWatch(filterParams, () => fetchData());

  onMounted(() => {
    fetchData();
  });

  return (
    <Card
      title={`评论列表（${comment.pagination?.total ?? '-'}）`}
      bordered={false}
      className={styles.comment}
      extra={
        <Button
          type="primary"
          size="small"
          target="_blank"
          icon={<RocketOutlined />}
          href={getFEGuestbookPath()}
        >
          去留言板
        </Button>
      }
    >
      <Space align="center" className={styles.toolbar}>
        <Space>
          <Select
            className={classnames(styles.select, styles.type)}
            loading={loading.state.value}
            value={filterParams.postId}
            onChange={(postId) => {
              filterParams.postId = postId;
            }}
            options={[
              {
                value: LIST_ALL_VALUE,
                label: '全部评论',
              },
              {
                value: COMMENT_GUESTBOOK_ID,
                label: '留言评论',
              },
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
                    placeholder="POST_ID"
                    enterButton={<span>GO</span>}
                    onSearch={updatePostId}
                  />
                </div>
              </div>
            )}
          />
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.state}
            onChange={(state) => {
              filterParams.state = state;
            }}
            options={[
              { label: '全部状态', value: SELECT_ALL_VALUE },
              ...commentStates.map((state) => {
                return {
                  value: state.id,
                  label: (
                    <Space>
                      {state.icon}
                      {state.name}
                    </Space>
                  ),
                };
              }),
            ]}
          />
          <Select
            className={styles.select}
            loading={loading.state.value}
            value={filterParams.sort}
            onChange={(sort) => {
              filterParams.sort = sort;
            }}
            options={sortTypes.map((sort) => {
              return {
                value: sort.id,
                label: (
                  <Space>
                    {sort.icon}
                    {sort.name}
                  </Space>
                ),
              };
            })}
          />
          <Input.Search
            className={styles.search}
            placeholder="输入评论内容、作者信息搜索"
            loading={loading.state.value}
            onSearch={() => fetchData()}
            value={serarchKeyword.value}
            onChange={(event) => {
              serarchKeyword.value = event.target.value;
            }}
          />
          <Button
            icon={<ReloadOutlined />}
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
                label: '退为草稿',
                icon: <EditOutlined />,
                onClick: () =>
                  handleStateChange(selectComments.value, CommentState.Auditing),
              },
              {
                label: '审核通过',
                icon: <CheckOutlined />,
                onClick: () =>
                  handleStateChange(selectComments.value, CommentState.Published),
              },
              {
                label: '标为垃圾',
                icon: <StopOutlined />,
                onClick: () =>
                  handleStateChange(selectComments.value, CommentState.Spam),
              },
              {
                label: '移回收站',
                icon: <DeleteOutlined />,
                onClick: () =>
                  handleStateChange(selectComments.value, CommentState.Deleted),
              },
              {
                label: '彻底删除',
                icon: <DeleteOutlined />,
                onClick: () => handleDelete(selectComments.value),
              },
            ]}
          >
            批量操作
          </DropdownMenu>
        </Space>
      </Space>
      <Divider />
      <CommentListTable
        loading={loading.state.value}
        selectedIds={selectedIds.value}
        onSelecte={handleSelect}
        data={comment.data}
        pagination={comment.pagination!}
        onPostId={updatePostId}
        onDetail={(_, index) => editData(index)}
        onDelete={(comment) => handleDelete([comment])}
        onUpdateState={(comment, state) => handleStateChange([comment], state)}
        onPagination={(page, pageSize) => fetchData({ page, per_page: pageSize })}
      />
      <EditDrawer
        loading={submitting.state.value}
        visible={isVisibleModal}
        comment={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};
