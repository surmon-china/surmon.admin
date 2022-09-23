import React from 'react'
import { Ref, useWatch } from 'veact'
import { Form, Typography, Input, Button, Divider, Drawer, Spin, Radio, Statistic } from 'antd'
import * as Icon from '@ant-design/icons'
import { IPLocation } from '@/components/common/IPLocation'
import { UniversalText } from '@/components/common/UniversalText'
import { Feedback, getMarkedByBoolean } from '@/constants/feedback'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'
import { stringToYMD } from '@/transforms/date'

export interface EditDrawerProps {
  loading: boolean
  visible: Ref<boolean>
  feedback: Ref<Feedback | null>
  onSubmit(feedback: Feedback): void
  onCancel(): void
}

export const EditDrawer: React.FC<EditDrawerProps> = (props) => {
  const [form] = Form.useForm<Feedback>()
  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit(formValue)
    })
  }

  useWatch(props.visible, (visible) => {
    if (visible) {
      const targetFeedback = props.feedback.value
      form.setFieldsValue(targetFeedback || {})
    } else {
      form.resetFields()
    }
  })

  const getFormElement = (feedback: Feedback) => (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      scrollToFirstError={true}
      colon={false}
      form={form}
    >
      <Form.Item label="ID">
        <Typography.Text copyable={true}>{feedback.id}</Typography.Text>
        <Divider type="vertical" />
        <Typography.Text copyable={true}>{feedback._id}</Typography.Text>
      </Form.Item>
      <Form.Item label="TID">
        <Typography.Text copyable={true}>{feedback.tid}</Typography.Text>
      </Form.Item>
      <Form.Item label="发布于">{stringToYMD(feedback.create_at!)}</Form.Item>
      <Form.Item label="最后修改于">{stringToYMD(feedback.update_at!)}</Form.Item>
      <Form.Item name="marked" label="是否标记">
        <Radio.Group size="middle">
          <Radio.Button value={false}>{getMarkedByBoolean(false).icon}</Radio.Button>
          <Radio.Button value={true}>{getMarkedByBoolean(true).icon}</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="user_name" label="用户昵称">
        <Input prefix={<Icon.UserOutlined />} />
      </Form.Item>
      <Form.Item name="user_email" label="用户邮箱">
        <Input prefix={<Icon.MailOutlined />} placeholder="email" type="email" />
      </Form.Item>
      <Form.Item label="IP 地址">
        <UniversalText text={feedback.ip || null} copyable={true} />
      </Form.Item>
      <Form.Item label="IP 地理位置">
        <IPLocation data={feedback.ip_location} fullname={true} />
      </Form.Item>
      <Form.Item label="终端">
        <UniversalText text={parseBrowser(feedback.user_agent!)} placeholder="未知浏览器" />
        <Divider type="vertical" />
        <UniversalText text={parseOS(feedback.user_agent!)} placeholder="未知系统" />
        <Divider type="vertical" />
        <UniversalText text={parseDevice(feedback.user_agent!)} placeholder="未知设备" />
      </Form.Item>
      <Form.Item label="反馈评分">
        <Statistic
          prefix={feedback.emotion_emoji}
          value={`${feedback.emotion_text} (${feedback.emotion})`}
        />
      </Form.Item>
      <Form.Item
        label="反馈内容"
        name="content"
        rules={[{ required: true, message: '请输入内容' }]}
      >
        <Input.TextArea autoSize={{ minRows: 8, maxRows: 18 }} />
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input.TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
      </Form.Item>
      <Form.Item label=" ">
        <Button
          icon={<Icon.CheckOutlined />}
          type="primary"
          loading={props.loading}
          onClick={handleSubmit}
        >
          提交更新
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <Drawer
      width="46rem"
      title="反馈详情"
      visible={props.visible.value}
      onClose={props.onCancel}
      destroyOnClose={true}
    >
      <Spin spinning={props.loading}>
        {props.feedback.value ? getFormElement(props.feedback.value) : null}
      </Spin>
    </Drawer>
  )
}
