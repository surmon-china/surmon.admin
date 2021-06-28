import React from 'react';
import { useShallowReactive, useRef, onMounted, useComputed } from '@/veact';
import { Button, Card, Divider, Modal, Space, Spin, Tree, Typography } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import {
  getCategoriesAntdTreeByTree,
  CategoryTree,
  getCategories,
  deleteCategory,
  putCategory,
  createCategory,
} from '@/store/category';
import { ResponsePaginationData, GeneralGetPageParams } from '@/constants/request';
import { Category as CategoryType } from '@/constants/category';
import { useLoading } from '@/services/loading';
import { getFECategoryPath } from '@/transformers/url';
import { EditModal } from './EditModal';

import styles from './style.module.less';

export const CategoryPage: React.FC = () => {
  const loading = useLoading();
  const submitting = useLoading();
  const loaded = useRef(false);
  const categories = useShallowReactive<
    ResponsePaginationData<CategoryType> & { tree: Array<CategoryTree> }
  >({
    tree: [],
    data: [],
    pagination: undefined,
  });

  // 弹窗
  const activeEditDataId = useRef<string | null>(null);
  const isVisibleModal = useRef(false);
  const activeEditData = useComputed(() => {
    const id = activeEditDataId.value;
    return id !== null ? categories.data.find((c) => c._id === id)! : null;
  });
  const closeModal = () => {
    isVisibleModal.value = false;
  };
  // 编辑创建
  const editData = (id: string) => {
    activeEditDataId.value = id;
    isVisibleModal.value = true;
  };
  const createNewData = () => {
    activeEditDataId.value = null;
    isVisibleModal.value = true;
  };

  const fetchData = (params?: GeneralGetPageParams) => {
    return loading.promise(getCategories(params)).then((result) => {
      categories.data = result.data;
      categories.tree = result.tree;
      categories.pagination = result.pagination;
    });
  };

  const refreshData = () => {
    fetchData({
      page: categories.pagination?.current_page,
      per_page: categories.pagination?.per_page,
    });
  };

  const handleDelete = (category: CategoryType) => {
    Modal.confirm({
      title: `确定要删除分类 “${category.name}” 吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () =>
        deleteCategory(category._id!).then(() => {
          refreshData();
        }),
    });
  };

  const handleSubmit = (category: CategoryType) => {
    if (activeEditData.value) {
      submitting
        .promise(
          putCategory({
            ...activeEditData.value,
            ...category,
          })
        )
        .then(() => {
          closeModal();
          refreshData();
        });
    } else {
      submitting.promise(createCategory(category)).then(() => {
        closeModal();
        refreshData();
      });
    }
  };

  onMounted(() => {
    fetchData().then(() => {
      // Fix for Tree
      setTimeout(() => {
        loaded.value = true;
      });
    });
  });

  return (
    <Card
      title={`分类列表（${categories.pagination?.total ?? '-'}）`}
      bordered={false}
      className={styles.category}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={createNewData}
        >
          创建新分类
        </Button>
      }
    >
      <Space className={styles.toolbar}>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            loading={loading.state.value}
            onClick={() => refreshData()}
          >
            刷新
          </Button>
        </Space>
      </Space>
      <Divider />
      <Spin spinning={loading.state.value}>
        {loaded.value && (
          <Tree
            className={styles.tree}
            checkable={false}
            blockNode={true}
            autoExpandParent={true}
            defaultExpandAll={true}
            showLine={true}
            showIcon={false}
            selectable={false}
            treeData={getCategoriesAntdTreeByTree(categories.tree)}
            titleRender={(nodeData) => {
              const category: CategoryTree = (nodeData as any).data;
              return (
                <div className={styles.categoryNode}>
                  <div className={styles.content}>
                    <Space className={styles.title}>
                      <Typography.Text strong={true}>{category.name}</Typography.Text>
                      <Divider type="vertical" />
                      <Typography.Text type="secondary">
                        {category.slug}
                      </Typography.Text>
                      <Divider type="vertical" />
                      <Typography.Text type="secondary">
                        {category.count} 篇
                      </Typography.Text>
                    </Space>
                    <div>
                      <Typography.Text type="secondary">
                        {category.description || '-'}
                      </Typography.Text>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <Button
                      size="small"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => editData(category._id!)}
                    >
                      编辑
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      size="small"
                      type="text"
                      danger={true}
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(category)}
                    >
                      删除
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      size="small"
                      icon={<LinkOutlined />}
                      type="link"
                      target="_blank"
                      href={getFECategoryPath(category.slug)}
                    >
                      查看
                    </Button>
                  </div>
                </div>
              );
            }}
          />
        )}
      </Spin>
      <EditModal
        title={activeEditData.value ? '编辑分类' : '新分类'}
        loading={submitting.state.value}
        tree={getCategoriesAntdTreeByTree(categories.tree, activeEditData.value?._id)}
        categories={categories.data}
        visible={isVisibleModal}
        category={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};
