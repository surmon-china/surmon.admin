/**
 * @file Article category page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowReactive, useRef, onMounted, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Empty, Divider, Modal, Space, Spin, Tree, Typography } from 'antd'
import * as Icon from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { ResponsePaginationData } from '@/constants/request'
import { Category as CategoryType } from '@/constants/category'
import { getBlogCategoryUrl } from '@/transforms/url'
import {
  getAntdTreeByTree,
  CategoryTree,
  getCategories,
  deleteCategory,
  putCategory,
  createCategory
} from '@/store/category'
import { EditModal } from './EditModal'

import styles from './style.module.less'

export const CategoryPage: React.FC = () => {
  const loading = useLoading()
  const submitting = useLoading()
  const loaded = useRef(false)
  const categories = useShallowReactive<
    ResponsePaginationData<CategoryType> & { tree: Array<CategoryTree> }
  >({ tree: [], data: [], pagination: void 0 })

  // 弹窗
  const activeEditDataId = useRef<string | null>(null)
  const isVisibleModal = useRef(false)
  const activeEditData = useComputed(() => {
    const id = activeEditDataId.value
    return id !== null ? categories.data.find((c) => c._id === id)! : null
  })

  const closeModal = () => {
    isVisibleModal.value = false
  }
  // 编辑创建
  const editData = (id: string) => {
    activeEditDataId.value = id
    isVisibleModal.value = true
  }
  const createNewData = () => {
    activeEditDataId.value = null
    isVisibleModal.value = true
  }

  const fetchData = () => {
    return loading.promise(getCategories({ per_page: 50 })).then((result) => {
      categories.data = result.data
      categories.tree = result.tree
      categories.pagination = result.pagination
    })
  }

  const handleDelete = (category: CategoryType) => {
    Modal.confirm({
      title: `确定要删除分类 “${category.name}” 吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () => {
        return deleteCategory(category._id!).then(() => {
          fetchData()
        })
      }
    })
  }

  const handleSubmit = (category: CategoryType) => {
    if (activeEditData.value) {
      submitting
        .promise(
          putCategory({
            ...activeEditData.value,
            ...category
          })
        )
        .then(() => {
          closeModal()
          fetchData()
        })
    } else {
      submitting.promise(createCategory(category)).then(() => {
        closeModal()
        fetchData()
      })
    }
  }

  onMounted(() => {
    fetchData().then(() => {
      // Fix for Tree
      setTimeout(() => {
        loaded.value = true
      })
    })
  })

  return (
    <Card
      title={`分类列表（${categories.pagination?.total ?? '-'}）`}
      bordered={false}
      className={styles.category}
      extra={
        <Button type="primary" size="small" icon={<Icon.PlusOutlined />} onClick={createNewData}>
          创建新分类
        </Button>
      }
    >
      <Space className={styles.toolbar}>
        <Space>
          <Button
            icon={<Icon.ReloadOutlined />}
            loading={loading.state.value}
            onClick={() => fetchData()}
          >
            刷新
          </Button>
        </Space>
      </Space>
      <Divider />
      <Spin spinning={loading.state.value}>
        {loaded.value && !categories.pagination?.total ? (
          <Empty
            description="暂无分类"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ marginBottom: '1rem' }}
          />
        ) : (
          <Tree
            className={styles.tree}
            checkable={false}
            blockNode={true}
            autoExpandParent={true}
            defaultExpandAll={true}
            virtual={false}
            showLine={true}
            showIcon={false}
            selectable={false}
            treeData={getAntdTreeByTree({
              tree: categories.tree,
              valuer: (c) => c._id
            })}
            titleRender={(nodeData) => {
              const category: CategoryTree = (nodeData as any).data
              return (
                <div className={styles.categoryNode}>
                  <div className={styles.content}>
                    <Space className={styles.title}>
                      <Typography.Text strong={true}>{category.name}</Typography.Text>
                      <Divider type="vertical" />
                      <Typography.Text type="secondary">{category.slug}</Typography.Text>
                      <Divider type="vertical" />
                      <Typography.Text type="secondary">
                        {category.article_count} 篇
                      </Typography.Text>
                    </Space>
                    <div>
                      <UniversalText type="secondary" text={category.description} />
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <Button
                      size="small"
                      type="text"
                      icon={<Icon.EditOutlined />}
                      onClick={() => editData(category._id!)}
                    >
                      编辑
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      size="small"
                      type="text"
                      danger={true}
                      icon={<Icon.DeleteOutlined />}
                      onClick={() => handleDelete(category)}
                    >
                      删除
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      size="small"
                      icon={<Icon.LinkOutlined />}
                      type="link"
                      target="_blank"
                      href={getBlogCategoryUrl(category.slug)}
                    >
                      查看
                    </Button>
                  </div>
                </div>
              )
            }}
          />
        )}
      </Spin>
      <EditModal
        title={activeEditData.value ? '编辑分类' : '新分类'}
        loading={submitting.state.value}
        tree={getAntdTreeByTree({
          tree: categories.tree,
          valuer: (c) => c._id,
          disabledWhen: (c) => {
            if (c._id === activeEditData.value?._id) {
              return true
            }
            if (c.pid === activeEditData.value?._id) {
              return true
            }
            return false
          }
        })}
        categories={categories.data}
        visible={isVisibleModal}
        category={activeEditData}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </Card>
  )
}
