import React from 'react'
import { Ref, useWatch } from 'veact'
import { Form, Input, Modal, TreeSelect, Typography, Divider, TreeDataNode } from 'antd'
import { FormDataKeyValue } from '@/components/common/FormDataKeyValue'
import { Category as CategoryType } from '@/constants/category'
import { stringToYMD } from '@/transforms/date'

const CATEGORY_NULL_VALUE = 'null'
const DEFAULT_CATEGORY: Partial<CategoryType> = {
  pid: CATEGORY_NULL_VALUE,
  extends: [
    {
      name: 'icon',
      value: 'icon-category',
    },
  ],
}

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

export interface EditModalProps {
  title: string
  loading: boolean
  visible: Ref<boolean>
  category: Ref<CategoryType | null>
  tree: TreeDataNode[]
  categories: CategoryType[]
  onSubmit(category: CategoryType): void
  onCancel(): void
}

export const EditModal: React.FC<EditModalProps> = (props) => {
  const [form] = Form.useForm<CategoryType>()
  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit({
        ...formValue,
        pid: formValue.pid === CATEGORY_NULL_VALUE ? null : formValue.pid,
      })
    })
  }

  useWatch(props.visible, (visible) => {
    if (!visible) {
      form.resetFields()
    } else {
      const propCategory = props.category.value
      if (propCategory) {
        form.setFieldsValue({
          ...propCategory,
          pid: propCategory.pid ?? CATEGORY_NULL_VALUE,
        })
      } else {
        form.setFieldsValue({ ...DEFAULT_CATEGORY })
      }
    }
  })

  return (
    <Modal
      title={props.title}
      confirmLoading={props.loading}
      visible={props.visible.value}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      centered={true}
      width={680}
      okText="提交"
    >
      <Form {...formLayout} colon={false} form={form}>
        {props.category.value && (
          <>
            <Form.Item label="ID">
              <Typography.Text copyable={true}>{props.category.value.id}</Typography.Text>
              <Divider type="vertical" />
              <Typography.Text copyable={true}>{props.category.value._id}</Typography.Text>
            </Form.Item>
            <Form.Item label="发布于">{stringToYMD(props.category.value.create_at)}</Form.Item>
            <Form.Item label="最后修改于">
              {stringToYMD(props.category.value.update_at)}
            </Form.Item>
          </>
        )}
        <Form.Item
          name="name"
          label="分类名称"
          extra="这将是它在站点上显示的名字"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input placeholder="分类名称" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="分类别名"
          extra="“别名” 是在 URL 中使用的别称，仅支持小写字母、数字、连字符（-）"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input placeholder="分类别名" />
        </Form.Item>
        <Form.Item
          name="pid"
          label="父分类"
          extra="可以选择父级分类"
          rules={[
            {
              message: '请选择正确的父分类',
              validator(_, value) {
                if (value === CATEGORY_NULL_VALUE) {
                  return Promise.resolve()
                }
                if (value === props.category.value?._id) {
                  return Promise.reject()
                }
                if (props.categories.some((c) => c._id === value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject()
                }
              },
            },
          ]}
        >
          <TreeSelect
            placeholder="选择父分类"
            treeDefaultExpandAll={true}
            treeData={[
              {
                label: '无',
                key: 'null',
                value: CATEGORY_NULL_VALUE,
              },
              ...props.tree,
            ]}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="分类描述"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input.TextArea rows={4} placeholder="分类描述" />
        </Form.Item>
        <Form.Item
          label="自定义扩展"
          extra="可以为当前分类增加自定义扩展属性，如：icon、background"
          shouldUpdate={true}
        >
          <FormDataKeyValue fieldName="extends" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
