import React from 'react'
import { onMounted } from 'veact'
import { Form, Typography, Input, Button, Divider, Radio, Statistic } from 'antd'
import * as Icons from '@ant-design/icons'
import { IPLocation } from '@/components/common/IPLocation'
import { UniversalText } from '@/components/common/UniversalText'
import { Feedback, getMarkedByBoolean } from '@/constants/feedback'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'
import { stringToYMD } from '@/transforms/date'

export interface EditFormProps {
  submitting: boolean
  feedback: Feedback
  onSubmit(feedback: Feedback): void
}

export const EditForm: React.FC<EditFormProps> = (props) => {
  const [form] = Form.useForm<Feedback>()

  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit(formValue)
    })
  }

  onMounted(() => {
    form.setFieldsValue(props.feedback)
  })

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      scrollToFirstError={true}
      colon={false}
      form={form}
    >
      <Form.Item label="ID">
        <Typography.Text copyable={true}>{props.feedback.id}</Typography.Text>
        <Divider type="vertical" />
        <Typography.Text copyable={true}>{props.feedback._id}</Typography.Text>
      </Form.Item>
      <Form.Item label="TID">
        <Typography.Text copyable={true}>{props.feedback.tid}</Typography.Text>
      </Form.Item>
      <Form.Item label="发布于">{stringToYMD(props.feedback.created_at!)}</Form.Item>
      <Form.Item label="最后修改于">{stringToYMD(props.feedback.updated_at!)}</Form.Item>
      <Form.Item name="marked" label="是否标记">
        <Radio.Group size="middle">
          <Radio.Button value={false}>{getMarkedByBoolean(false).icon}</Radio.Button>
          <Radio.Button value={true}>{getMarkedByBoolean(true).icon}</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="user_name" label="用户昵称">
        <Input prefix={<Icons.UserOutlined />} />
      </Form.Item>
      <Form.Item name="user_email" label="用户邮箱">
        <Input prefix={<Icons.MailOutlined />} placeholder="email" type="email" />
      </Form.Item>
      <Form.Item label="IP 地址">
        <UniversalText text={props.feedback.ip || null} copyable={true} />
      </Form.Item>
      <Form.Item label="IP 地理位置">
        <IPLocation data={props.feedback.ip_location} fullname={true} />
      </Form.Item>
      <Form.Item label="终端">
        <UniversalText text={parseBrowser(props.feedback.user_agent!)} placeholder="未知浏览器" />
        <Divider type="vertical" />
        <UniversalText text={parseOS(props.feedback.user_agent!)} placeholder="未知系统" />
        <Divider type="vertical" />
        <UniversalText text={parseDevice(props.feedback.user_agent!)} placeholder="未知设备" />
      </Form.Item>
      <Form.Item label="反馈评分">
        <Statistic
          prefix={props.feedback.emotion_emoji}
          value={`${props.feedback.emotion_text} (${props.feedback.emotion})`}
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
          type="primary"
          icon={<Icons.CheckOutlined />}
          loading={props.submitting}
          onClick={handleSubmit}
        >
          提交更新
        </Button>
      </Form.Item>
    </Form>
  )
}
