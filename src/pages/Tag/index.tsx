/**
 * @file Tag list page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react';
import { useShallowReactive, useRef, onMounted, useReactive, useComputed } from 'veact';
import { Table, Button, Card, Input, Divider, Spin, Modal, Space } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { DropdownMenu } from '@/components/common/DropdownMenu';
import {
  getTags,
  GetTagParams,
  deleteTag,
  deleteTags,
  putTag,
  createTag,
} from '@/store/tag';
import { Tag } from '@/constants/tag';
import { ResponsePaginationData } from '@/constants/request';
import { useLoading } from '@/services/loading';
import { scrollTo } from '@/services/scroller';
import { getFETagPath } from '@/transformers/url';
import { EditModal } from './EditModal';

import styles from './style.module.less';

export const TagPage: React.FC = () => {
  const loading = useLoading();
  const submitting = useLoading();
  const tag = useShallowReactive<ResponsePaginationData<Tag>>({
    data: [],
    pagination: undefined,
  });

  // 多选
  const selectedIDs = useRef<Array<string>>([]);
  const handleSelect = (ids: any[]) => {
    selectedIDs.value = ids;
  };

  // 过滤参数
  const filterParams = useReactive({
    keyword: '',
  });

  // 弹窗
  const activeEditDataIndex = useRef<number | null>(null);
  const isVisibleModal = useRef(false);
  const activeEditData = useComputed(() => {
    const index = activeEditDataIndex.value;
    return index !== null ? tag.data[index] : null;
  });
  const closeModal = () => {
    isVisibleModal.value = false;
  };
  // 编辑创建
  const editData = (index: number) => {
    activeEditDataIndex.value = index;
    isVisibleModal.value = true;
  };
  const createNewData = () => {
    activeEditDataIndex.value = null;
    isVisibleModal.value = true;
  };

  const fetchData = (params?: GetTagParams) => {
    const getParams = { ...params };
    if (!!filterParams.keyword) {
      getParams.keyword = filterParams.keyword;
    }

    loading.promise(getTags(getParams)).then((response) => {
      tag.data = response.data;
      tag.pagination = response.pagination;
      scrollTo(document.body);
    });
  };

  const resetParamsAndRefresh = () => {
    filterParams.keyword = '';
    fetchData();
  };

  const refreshData = () => {
    fetchData({
      page: tag.pagination?.current_page,
      per_page: tag.pagination?.per_page,
    });
  };

  const handleDelete = (tag: Tag) => {
    Modal.confirm({
      title: `确定要删除标签 “${tag.name}” 吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () =>
        deleteTag(tag._id!).then(() => {
          refreshData();
        }),
    });
  };

  const handleDeleteList = () => {
    const ids = selectedIDs.value;
    Modal.confirm({
      title: `确定要删除 ${ids.length} 个标签吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () =>
        deleteTags(ids).then(() => {
          refreshData();
        }),
    });
  };

  const handleSubmit = (tag: Tag) => {
    if (activeEditData.value) {
      submitting
        .promise(
          putTag({
            ...activeEditData.value,
            ...tag,
          })
        )
        .then(() => {
          closeModal();
          refreshData();
        });
    } else {
      submitting.promise(createTag(tag)).then(() => {
        closeModal();
        refreshData();
      });
    }
  };

  onMounted(() => {
    fetchData();
  });

  return (
    <Card
      title={`标签列表（${tag.pagination?.total ?? '-'}）`}
      bordered={false}
      className={styles.tag}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={createNewData}
        >
          创建新标签
        </Button>
      }
    >
      <Space className={styles.toolbar}>
        <Space>
          <Input.Search
            className={styles.search}
            placeholder="输入关键词搜索"
            loading={loading.state.value}
            onSearch={() => fetchData()}
            value={filterParams.keyword}
            onChange={(event) => {
              filterParams.keyword = event.target.value;
            }}
          />
          <Button
            icon={<ReloadOutlined />}
            loading={loading.state.value}
            onClick={resetParamsAndRefresh}
          >
            重置并刷新
          </Button>
        </Space>
        <Space>
          <DropdownMenu
            disabled={!selectedIDs.value.length}
            options={[
              {
                label: '批量删除',
                icon: <DeleteOutlined />,
                onClick: handleDeleteList,
              },
            ]}
          >
            批量操作
          </DropdownMenu>
        </Space>
      </Space>
      <Divider />
      <Spin spinning={loading.state.value}>
        <Table<Tag>
          rowKey="_id"
          dataSource={tag.data}
          rowSelection={{
            selectedRowKeys: selectedIDs.value,
            onChange: handleSelect,
          }}
          pagination={{
            current: tag.pagination?.current_page,
            pageSize: tag.pagination?.per_page,
            total: tag.pagination?.total,
            showSizeChanger: true,
            onChange(page, pageSize) {
              return fetchData({ page, per_page: pageSize });
            },
          }}
          columns={[
            {
              title: 'ID',
              width: 60,
              dataIndex: 'id',
            },
            {
              title: '名称',
              dataIndex: 'name',
              width: 140,
            },
            {
              title: '别名',
              dataIndex: 'slug',
              width: 160,
            },
            {
              title: '描述',
              dataIndex: 'description',
            },
            {
              title: '文章',
              width: 80,
              align: 'right',
              dataIndex: 'count',
            },
            {
              title: '操作',
              width: 240,
              align: 'right',
              dataIndex: 'actions',
              render: (_, tag, index) => (
                <Button.Group>
                  <Button
                    size="small"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => editData(index)}
                  >
                    编辑
                  </Button>
                  <Button
                    size="small"
                    type="text"
                    danger={true}
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(tag)}
                  >
                    删除
                  </Button>
                  <Button
                    size="small"
                    type="link"
                    target="_blank"
                    icon={<LinkOutlined />}
                    href={getFETagPath(tag.slug)}
                  >
                    查看
                  </Button>
                </Button.Group>
              ),
            },
          ]}
        />
      </Spin>
      <EditModal
        title={activeEditData.value ? '编辑标签' : '新标签'}
        loading={submitting.state.value}
        visible={isVisibleModal}
        tag={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};
