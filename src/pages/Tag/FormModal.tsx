import React, { useEffect } from 'react'
import { Form, Input, Modal, Divider, Typography } from 'antd'
import { FormKeyValueInput } from '@/components/common/FormKeyValueInput'
import { Tag as TagType } from '@/constants/tag'
import { stringToYMD } from '@/transforms/date'

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}

const DEFAULT_TAG_DATA: Partial<TagType> = {
  extends: [
    {
      name: 'icon',
      value: 'icon-tag'
    }
  ]
}

export interface FormModalProps {
  title: string
  visible: boolean
  submitting: boolean
  initData: TagType | null
  onSubmit(tag: TagType): void
  onCancel(): void
}

export const FormModal: React.FC<FormModalProps> = (props) => {
  const [form] = Form.useForm<TagType>()

  const handleSubmit = () => {
    form.validateFields().then(props.onSubmit)
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(props.initData ?? DEFAULT_TAG_DATA)
  }, [props.initData, props.visible])

  return (
    <Modal
      width={680}
      centered={true}
      forceRender={true}
      title={props.title}
      confirmLoading={props.submitting}
      open={props.visible}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      okText="提交"
    >
      <Form {...formLayout} colon={false} form={form}>
        {props.initData && (
          <>
            <Form.Item label="ID">
              <Typography.Text copyable={true}>{props.initData?.id}</Typography.Text>
              <Divider type="vertical" />
              <Typography.Text copyable={true}>{props.initData?._id}</Typography.Text>
            </Form.Item>
            <Form.Item label="创建于">{stringToYMD(props.initData?.created_at)}</Form.Item>
            <Form.Item label="最后修改于">{stringToYMD(props.initData?.updated_at)}</Form.Item>
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
          <FormKeyValueInput fieldName="extends" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
