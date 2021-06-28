import React from 'react';
import {
  useShallowReactive,
  useRef,
  onMounted,
  useReactive,
  useWatch,
  useComputed,
} from '@/veact';
import {
  Table,
  Button,
  Card,
  Input,
  Tag,
  Select,
  Divider,
  Spin,
  Modal,
  Space,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { DropdownMenu } from '@/components/common/DropdownMenu';
import {
  getAnnouncements,
  GetAnnouncementsParams,
  deleteAnnouncement,
  deleteAnnouncements,
  putAnnouncement,
  createAnnouncement,
} from '@/store/announcement';
import { Announcement as AnnouncementType } from '@/constants/announcement';
import { ResponsePaginationData } from '@/constants/request';
import { PublishState, ps } from '@/constants/publish-state';
import { useLoading } from '@/services/loading';
import { stringToYMD } from '@/transformers/date';
import { EditModal } from './EditModal';
import styles from './style.module.less';

export const STATE_IDS = [PublishState.Draft, PublishState.Published];

const SELECT_ALL_VALUE = 'ALL';

export const AnnouncementPage: React.FC = () => {
  const loading = useLoading();
  const submitting = useLoading();
  const announcement = useShallowReactive<ResponsePaginationData<AnnouncementType>>({
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
    state: SELECT_ALL_VALUE as typeof SELECT_ALL_VALUE | PublishState,
    keyword: '',
  });

  // 弹窗
  const activeEditDataIndex = useRef<number | null>(null);
  const isVisibleModal = useRef(false);
  const activeEditData = useComputed(() => {
    const index = activeEditDataIndex.value;
    return index !== null ? announcement.data[index] : null;
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

  const fetchData = (params?: GetAnnouncementsParams) => {
    const getParams = { ...params };
    if (filterParams.state !== SELECT_ALL_VALUE) {
      getParams.state = filterParams.state;
    }
    if (!!filterParams.keyword) {
      getParams.keyword = filterParams.keyword;
    }
    loading.promise(getAnnouncements(getParams)).then((response) => {
      announcement.data = response.data;
      announcement.pagination = response.pagination;
    });
  };

  const refreshData = (reset: boolean = false) => {
    if (reset) {
      filterParams.keyword = '';
      filterParams.state = SELECT_ALL_VALUE;
      fetchData();
    } else {
      fetchData({
        page: announcement.pagination?.current_page,
        per_page: announcement.pagination?.per_page,
      });
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定要删除公告吗？',
      content: '删除后不可恢复',
      centered: true,
      onOk: () =>
        deleteAnnouncement(id).then(() => {
          refreshData();
        }),
    });
  };

  const handleDeleteList = () => {
    const ids = selectedIDs.value;
    Modal.confirm({
      title: `确定要删除 ${ids.length} 个公告吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () =>
        deleteAnnouncements(ids).then(() => {
          refreshData();
        }),
    });
  };

  const handleSubmit = (announcement: AnnouncementType) => {
    if (activeEditData.value) {
      submitting
        .promise(
          putAnnouncement({
            ...activeEditData.value,
            ...announcement,
          })
        )
        .then(() => {
          closeModal();
          refreshData();
        });
    } else {
      submitting.promise(createAnnouncement(announcement)).then(() => {
        closeModal();
        refreshData();
      });
    }
  };

  useWatch(
    () => filterParams.state,
    () => fetchData()
  );

  onMounted(() => {
    fetchData();
  });

  return (
    <Card
      title={`公告列表（${announcement.pagination?.total ?? '-'}）`}
      bordered={false}
      className={styles.announcement}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={createNewData}
        >
          发布新公告
        </Button>
      }
    >
      <Space align="center" className={styles.toolbar}>
        <Space>
          <Select
            className={styles.selec}
            loading={loading.state.value}
            value={filterParams.state}
            onChange={(state) => {
              filterParams.state = state;
            }}
            options={[
              { label: '全部状态', value: SELECT_ALL_VALUE },
              ...STATE_IDS.map((state) => {
                const target = ps(state);
                return {
                  value: target.id,
                  label: (
                    <Space>
                      {target.icon}
                      {target.name}
                    </Space>
                  ),
                };
              }),
            ]}
          />
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
            onClick={() => refreshData(true)}
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
        <Table<AnnouncementType>
          rowKey="_id"
          dataSource={announcement.data}
          rowSelection={{
            selectedRowKeys: selectedIDs.value,
            onChange: handleSelect,
          }}
          pagination={{
            current: announcement.pagination?.current_page,
            pageSize: announcement.pagination?.per_page,
            total: announcement.pagination?.total,
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
              title: '内容',
              dataIndex: 'content',
            },
            {
              title: '发布时间',
              dataIndex: 'create_at',
              width: 180,
              render: (_, ann) => stringToYMD(ann.create_at),
            },
            {
              title: '状态',
              width: 120,
              dataIndex: 'state',
              render: (_, ann) => {
                const state = ps(ann.state);
                return (
                  <Tag icon={state.icon} color={state.color}>
                    {state.name}
                  </Tag>
                );
              },
            },
            {
              title: '操作',
              width: 160,
              dataIndex: 'actions',
              render: (_, ann, index) => (
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
                    onClick={() => handleDelete(ann._id!)}
                  >
                    删除
                  </Button>
                </Button.Group>
              ),
            },
          ]}
        />
      </Spin>
      <EditModal
        title={activeEditData.value ? '编辑公告' : '新公告'}
        loading={submitting.state.value}
        visible={isVisibleModal}
        announcement={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};
