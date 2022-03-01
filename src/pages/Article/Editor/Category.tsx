import React from 'react'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Spin, Button, Form, Tree, Typography, Divider, Space, FormInstance } from 'antd'
import * as Icon from '@ant-design/icons'
import { getCategories, CategoryTree, getAntdTreeByTree } from '@/store/category'
import { CategoryFormModel } from '.'

import styles from './style.module.less'

interface CategorySelectProps {
  value?: Array<string>
  onChange?(value: Array<string>): void
}
const CategorySelect: React.FC<CategorySelectProps> = (props) => {
  const categoriesLoading = useLoading()
  const categories = useRef<Array<CategoryTree>>([])
  const fetchCategories = () => {
    categoriesLoading.promise(getCategories({ per_page: 50 })).then((result) => {
      categories.value = result.tree
    })
  }

  onMounted(() => {
    fetchCategories()
  })

  return (
    <div>
      {!categories.value.length ? (
        <Typography.Text type="secondary">无分类</Typography.Text>
      ) : (
        <Spin spinning={categoriesLoading.state.value}>
          <Tree
            className={styles.categorySelect}
            showLine={true}
            checkable={true}
            blockNode={true}
            defaultExpandAll={true}
            checkStrictly={true}
            checkedKeys={props.value}
            onCheck={(data) => {
              const ids = Array.isArray(data) ? data : data.checked
              props.onChange?.(ids as string[])
            }}
            treeData={getAntdTreeByTree({
              tree: categories.value,
              valuer: (c) => c._id,
            })}
            titleRender={(nodeData) => {
              const category: CategoryTree = (nodeData as any).data
              return (
                <Space size="small">
                  <Typography.Text strong={true}>{category.name}</Typography.Text>
                  <Divider type="vertical" />
                  {category.slug}
                </Space>
              )
            }}
          />
        </Spin>
      )}
      <Divider />
      <Button
        size="small"
        type="dashed"
        icon={<Icon.ReloadOutlined />}
        loading={categoriesLoading.state.value}
        onClick={fetchCategories}
      >
        刷新列表
      </Button>
    </div>
  )
}

export interface CategoryFormProps {
  form: FormInstance<CategoryFormModel>
}
export const CategoryForm: React.FC<CategoryFormProps> = (props) => {
  return (
    <Form scrollToFirstError={true} form={props.form}>
      <Form.Item
        noStyle={true}
        required={true}
        name="category"
        rules={[
          {
            message: '至少应该选择一个分类',
            validator(_, value: string[]) {
              if (!!value?.length) {
                return Promise.resolve()
              } else {
                return Promise.reject()
              }
            },
          },
        ]}
      >
        <CategorySelect />
      </Form.Item>
    </Form>
  )
}
