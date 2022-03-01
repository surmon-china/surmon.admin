import React from 'react'
import { useNavigate } from 'react-router-dom'
import { onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Form, Input, Button, Spin, Divider, notification } from 'antd'
import * as Icon from '@ant-design/icons'

import { RouteKey, rc } from '@/routes'
import { ImageUploader } from '@/components/common/ImageUploader'
import { Auth } from '@/constants/auth'
import { scrollTo } from '@/services/scroller'
import { removeToken } from '@/services/token'
import { useAdminState } from '@/state/admin'
import { putAuth } from '@/store/auth'
import styles from './style.module.less'

export interface BaseFormProps {
  labelSpan: number
  wrapperSpan: number
}

export const AuthForm: React.FC<BaseFormProps> = (props) => {
  const navigate = useNavigate()
  const submitting = useLoading()
  const adminAuth = useAdminState()
  const [form] = Form.useForm<Auth>()

  const fetchNewAdminAuth = () => {
    adminAuth.refresh().then(form.setFieldsValue)
  }

  const updateAdminAuth = (_adminAuth: Auth) => {
    return submitting.promise(putAuth(_adminAuth)).then(() => {
      if (_adminAuth.new_password) {
        notification.info({
          message: '修改了新密码，即将跳转到登录页...',
        })
        setTimeout(() => {
          removeToken()
          navigate(rc(RouteKey.Hello).path)
        }, 1688)
      } else {
        fetchNewAdminAuth()
      }
    })
  }

  const handleSubmit = () => {
    form.validateFields().then((newAdminAuth) => {
      Reflect.deleteProperty(newAdminAuth, 'rel_new_password')
      updateAdminAuth({
        ...adminAuth.data,
        ...newAdminAuth,
      }).then(() => {
        scrollTo(document.body)
      })
    })
  }

  // 验证重复输入密码
  const validatePassword = async () => {
    const password = form.getFieldValue('password')
    const newPassword = form.getFieldValue('new_password')
    const reallyNewPassword = form.getFieldValue('rel_new_password')
    if (!password && !newPassword && !reallyNewPassword) {
      return
    }
    if (newPassword !== reallyNewPassword || password === newPassword) {
      throw new Error()
    }
  }

  onMounted(() => {
    fetchNewAdminAuth()
  })

  return (
    <Spin spinning={submitting.state.value}>
      <Form
        colon={false}
        scrollToFirstError={true}
        className={styles.form}
        form={form}
        labelCol={{ span: props.labelSpan }}
        wrapperCol={{ span: props.wrapperSpan }}
      >
        <Form.Item
          name="avatar"
          label="头像"
          required={true}
          wrapperCol={{ span: 6 }}
          rules={[{ required: true, message: '请上传图片' }]}
        >
          <ImageUploader disabledMarkdown={true} />
        </Form.Item>
        <Form.Item
          name="name"
          label="昵称"
          required={true}
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input placeholder="昵称" />
        </Form.Item>
        <Form.Item
          name="slogan"
          label="签名"
          required={true}
          rules={[{ required: true, message: '请输入签名' }]}
        >
          <Input placeholder="签名" />
        </Form.Item>
        <Divider />
        <Form.Item
          name="password"
          label="旧密码"
          rules={[
            {
              message: '确保新旧密码不一致，且有效',
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password placeholder="旧密码" autoComplete="password" />
        </Form.Item>
        <Form.Item
          name="new_password"
          label="新密码"
          rules={[
            {
              message: '确保新旧密码不一致，且有效',
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password placeholder="新密码" autoComplete="new_password" />
        </Form.Item>
        <Form.Item
          name="rel_new_password"
          label="确认新密码"
          rules={[
            {
              message: '确保新旧密码不一致，且有效',
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password placeholder="确认新密码" autoComplete="rel_new_password" />
        </Form.Item>
        <Form.Item label=" ">
          <Button
            icon={<Icon.CheckOutlined />}
            type="primary"
            loading={submitting.state.value}
            onClick={handleSubmit}
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}
