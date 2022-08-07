import React from 'react'
import { Ref, useWatch } from 'veact'
import { Form, Input, Modal, Divider, Typography } from 'antd'

import { FormDataKeyValue } from '@/components/common/FormDataKeyValue'
import { Tag as TagType } from '@/constants/tag'
import { stringToYMD } from '@/transforms/date'

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

export interface EditModalProps {
  title: string
  loading: boolean
  visible: Ref<boolean>
  tag: Ref<TagType | null>
  onSubmit(tag: TagType): void
  onCancel(): void
}

export const EditModal: React.FC<EditModalProps> = (props) => {
  const [form] = Form.useForm<TagType>()
  const handleSubmit = () => {
    form.validateFields().then(props.onSubmit)
  }

  useWatch(props.visible, (visible) => {
    if (!visible) {
      form.resetFields()
    } else {
      form.setFieldsValue(
        props.tag.value || {
          extends: [
            {
              name: 'icon',
              value: 'icon-tag',
            },
          ],
        }
      )
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
        {props.tag.value && (
          <>
            <Form.Item label="ID">
              <Typography.Text copyable={true}>{props.tag.value?.id}</Typography.Text>
              <Divider type="vertical" />
              <Typography.Text copyable={true}>{props.tag.value?._id}</Typography.Text>
            </Form.Item>
            <Form.Item label="发布于">{stringToYMD(props.tag.value?.create_at)}</Form.Item>
            <Form.Item label="最后修改于">{stringToYMD(props.tag.value?.update_at)}</Form.Item>
          </>
        )}
        <Form.Item
          name="name"
          label="标签名称"
          extra="这将是它在站点上显示的名字"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input placeholder="标签名称" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="标签别名"
          extra="“别名” 是在 URL 中使用的别称，仅支持小写字母、数字、连字符（-）"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input placeholder="标签别名" />
        </Form.Item>
        <Form.Item
          name="description"
          label="标签描述"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input.TextArea rows={4} placeholder="标签描述" />
        </Form.Item>
        <Form.Item
          label="自定义扩展"
          extra="可以为当前标签增加自定义扩展属性，如：icon、background"
          shouldUpdate={true}
        >
          <FormDataKeyValue fieldName="extends" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
