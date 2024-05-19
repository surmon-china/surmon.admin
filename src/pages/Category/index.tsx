/**
 * @file Category page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowReactive, useShallowRef, useRef, onMounted, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Divider, Modal, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { ResponsePaginationData } from '@/constants/nodepress'
import { Category as CategoryType } from '@/constants/category'
import type { CategoryTree } from '@/apis/category'
import * as api from '@/apis/category'
import { FormModal } from './FormModal'
import { TreeList } from './TreeList'

export const CategoryPage: React.FC = () => {
  const { i18n } = useTranslation()
  const loading = useLoading()
  const submitting = useLoading()
  const categoriesTree = useShallowRef<CategoryTree[]>([])
  const categoriesList = useShallowReactive<ResponsePaginationData<CategoryType>>({
    data: [],
    pagination: void 0
  })

  // modal
  const isVisibleModal = useRef(false)
  const activeEditCategoryId = useRef<string | null>(null)
  const activeEditCategory = useComputed(() => {
    const id = activeEditCategoryId.value
    return id !== null ? categoriesList.data.find((c) => c._id === id)! : null
  })

  const closeModal = () => {
    isVisibleModal.value = false
  }

  const openEditModal = (id: string) => {
    activeEditCategoryId.value = id
    isVisibleModal.value = true
  }

  const openCreateModal = () => {
    isVisibleModal.value = true
    activeEditCategoryId.value = null
  }

  const fetchCategories = () => {
    return loading.promise(api.getCategories({ per_page: 50 })).then((result) => {
      categoriesList.data = result.data
      categoriesList.pagination = result.pagination
      categoriesTree.value = result.tree
    })
  }

  const createCategory = (category: CategoryType) => {
    submitting.promise(api.createCategory(category)).then(() => {
      closeModal()
      fetchCategories()
    })
  }

  const updateCategory = (category: CategoryType) => {
    const payload = {
      ...activeEditCategory.value,
      ...category
    }
    submitting.promise(api.putCategory(payload)).then(() => {
      closeModal()
      fetchCategories()
    })
  }

  const deleteCategory = (category: CategoryType) => {
    Modal.confirm({
      title: `确定要删除分类「 ${category.name} 」吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () => {
        return api.deleteCategory(category._id!).then(() => {
          fetchCategories()
        })
      }
    })
  }

  onMounted(() => fetchCategories())

  return (
    <Card
      bordered={false}
      title={i18n.t('page.category.list.title', {
        total: categoriesList.pagination?.total ?? '-'
      })}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<Icons.PlusOutlined />}
          onClick={openCreateModal}
        >
          创建新分类
        </Button>
      }
    >
      <Space>
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={loading.state.value}
          onClick={() => fetchCategories()}
        >
          {i18n.t('common.list.filter.refresh')}
        </Button>
      </Space>
      <Divider />
      <TreeList
        tree={categoriesTree.value}
        loading={loading.state.value}
        onEdit={(category) => openEditModal(category._id!)}
        onDelete={(category) => deleteCategory(category)}
      />
      <FormModal
        title={activeEditCategory.value ? '编辑分类' : '新分类'}
        loading={submitting.state.value}
        visible={isVisibleModal.value}
        initData={activeEditCategory.value}
        onCancel={() => closeModal()}
        onSubmit={(category) => {
          activeEditCategory.value ? updateCategory(category) : createCategory(category)
        }}
        selectTree={api.getAntdTreeByTree({
          tree: categoriesTree.value,
          valuer: (category) => category._id,
          disabledWhen: (category) => {
            if (category._id === activeEditCategory.value?._id) {
              return true
            } else if (category.pid === activeEditCategory.value?._id) {
              return true
            } else {
              return false
            }
          }
        })}
      />
    </Card>
  )
}
