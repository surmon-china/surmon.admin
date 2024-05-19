import React, { useEffect } from 'react'
import { Form, Select, Modal, Space, Divider, Typography } from 'antd'
import { UniversalEditor } from '@/components/common/UniversalEditor'
import { Announcement, AnnouncementState, announcementStates } from '@/constants/announcement'
import { stringToYMD } from '@/transforms/date'

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 }
}

export interface FormModalProps {
  title: string
  visible: boolean
  submitting: boolean
  initData: Announcement | null
  onSubmit(data: Announcement): void
  onCancel(): void
}

export const FormModal: React.FC<FormModalProps> = (props) => {
  const [form] = Form.useForm<Announcement>()

  const handleSubmit = () => {
    form.validateFields().then(props.onSubmit)
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(props.initData ?? {})
  }, [props.initData, props.visible])

  return (
    <Modal
      width={680}
      centered={true}
      forceRender={true}
      destroyOnClose={true}
      title={props.title}
      open={props.visible}
      confirmLoading={props.submitting}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      okText="提交"
    >
      <Form {...formLayout} colon={false} form={form}>
        {props.initData && (
          <>
            <Form.Item label="ID">
              <Typography.Text copyable={true}>{props.initData.id}</Typography.Text>
              <Divider type="vertical" />
              <Typography.Text copyable={true}>{props.initData._id}</Typography.Text>
            </Form.Item>
            <Form.Item label="发布于">{stringToYMD(props.initData.created_at)}</Form.Item>
            <Form.Item label="最后修改于">{stringToYMD(props.initData.updated_at)}</Form.Item>
          </>
        )}
        <Form.Item
          label="发布状态"
          name="state"
          initialValue={AnnouncementState.Published}
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select
            placeholder="选择状态"
            options={announcementStates.map((state) => ({
              value: state.id,
              label: (
                <Space size="small">
                  {state.icon}
                  {state.name}
                </Space>
              )
            }))}
          />
        </Form.Item>
        <Form.Item
          label="公告内容"
          name="content"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <UniversalEditor
            placeholder="输入公告内容..."
            rows={10}
            autoFocus={true}
            disabledToolbar={true}
            disabledFoldGutter={true}
            disabledLineNumbers={true}
            disabledCacheDraft={true}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
