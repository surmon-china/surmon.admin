import React from 'react'
import { Button, Form, Select, Divider, Space, Switch, FormInstance } from 'antd'
import * as Icons from '@ant-design/icons'
import { articlePublics, articlePublishs } from '@/constants/article'
import { articleOrigins, articleLanguages } from '@/constants/article'
import { StatesFormModel } from '.'

const REQUIRED_RULE = {
  message: '必选',
  required: true
}

export interface StatesFormProps {
  form: FormInstance<StatesFormModel>
  submitting: boolean
  onSubmit(): void
}

export const StatesForm: React.FC<StatesFormProps> = (props) => {
  return (
    <Form
      scrollToFirstError={true}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 13, offset: 1 }}
      colon={false}
      form={props.form}
    >
      <Form.Item required={true} name="state" label="发布状态" rules={[REQUIRED_RULE]}>
        <Select
          placeholder="文章发布状态"
          options={articlePublishs.map((state) => {
            return {
              value: state.id,
              label: (
                <Space size="small">
                  {state.icon}
                  {state.name}
                </Space>
              )
            }
          })}
        />
      </Form.Item>
      <Form.Item required={true} name="origin" label="文章来源" rules={[REQUIRED_RULE]}>
        <Select
          placeholder="文章来源"
          options={articleOrigins.map((state) => {
            return {
              value: state.id,
              label: (
                <Space size="small">
                  {state.icon}
                  {state.name}
                </Space>
              )
            }
          })}
        />
      </Form.Item>
      <Form.Item required={true} name="public" label="公开类型" rules={[REQUIRED_RULE]}>
        <Select
          placeholder="文章公开类型"
          options={articlePublics.map((state) => {
            return {
              value: state.id,
              label: (
                <Space size="small">
                  {state.icon}
                  {state.name}
                </Space>
              )
            }
          })}
        />
      </Form.Item>
      <Form.Item required={true} name="lang" label="内容语言" rules={[REQUIRED_RULE]}>
        <Select
          placeholder="文章语言"
          options={articleLanguages.map((state) => {
            return {
              value: state.id,
              label: (
                <Space size="small">
                  {state.icon}
                  {state.name}
                </Space>
              )
            }
          })}
        />
      </Form.Item>
      <Form.Item
        required={true}
        name="featured"
        label="精选文章"
        rules={[REQUIRED_RULE]}
        valuePropName="checked"
      >
        <Switch checkedChildren="是" unCheckedChildren="否" style={{ width: 50 }} />
      </Form.Item>
      <Form.Item
        required={true}
        name="disabled_comments"
        label="禁止评论"
        rules={[REQUIRED_RULE]}
        valuePropName="checked"
      >
        <Switch checkedChildren="是" unCheckedChildren="否" style={{ width: 50 }} />
      </Form.Item>
      <Divider />
      <Button
        type="primary"
        block={true}
        icon={<Icons.CheckOutlined />}
        loading={props.submitting}
        onClick={props.onSubmit}
      >
        提交
      </Button>
    </Form>
  )
}
