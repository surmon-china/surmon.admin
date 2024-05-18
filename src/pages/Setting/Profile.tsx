import React from 'react'
import { onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Spin, Divider, notification } from 'antd'
import * as Icon from '@ant-design/icons'
import { RoutesKey, RoutesPath } from '@/routes'
import { useAdminProfile } from '@/contexts/AdminProfile'
import { ImageUploader } from '@/components/common/ImageUploader'
import { AdminProfile } from '@/constants/admin'
import { getAdminProfile, putAdminProfile } from '@/apis/admin'
import { scrollTo } from '@/services/scroller'
import { removeToken } from '@/services/token'

export const ProfileForm: React.FC = () => {
  const navigate = useNavigate()
  const loading = useLoading()
  const updating = useLoading()
  const globalAdminProfile = useAdminProfile()
  const [form] = Form.useForm<AdminProfile>()

  const fetchLatestProfile = () => {
    loading.promise(getAdminProfile()).then(form.setFieldsValue)
  }

  const updateProfile = (adminProfile: AdminProfile) => {
    return updating.promise(putAdminProfile(adminProfile)).then(() => {
      if (adminProfile.new_password) {
        notification.info({
          message: '修改了新密码，即将跳转到登录页...'
        })
        setTimeout(() => {
          removeToken()
          navigate(RoutesPath[RoutesKey.Hello])
        }, 1688)
      } else {
        fetchLatestProfile()
        globalAdminProfile.refresh()
      }
    })
  }

  const handleSubmit = () => {
    form.validateFields().then((newAdminAuth) => {
      Reflect.deleteProperty(newAdminAuth, 'rel_new_password')
      updateProfile({ ...newAdminAuth }).then(() => {
        scrollTo(document.body)
      })
    })
  }

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
    fetchLatestProfile()
  })

  return (
    <Spin spinning={loading.state.value || updating.state.value}>
      <Form layout="vertical" form={form} colon={false} scrollToFirstError={true}>
        <Form.Item
          name="avatar"
          label="头像"
          required={true}
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
          <Input.TextArea placeholder="签名" />
        </Form.Item>
        <Divider />
        <Form.Item
          name="password"
          label="旧密码"
          rules={[
            {
              message: '确保新旧密码不一致，且有效',
              validator: validatePassword
            }
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
              validator: validatePassword
            }
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
              validator: validatePassword
            }
          ]}
        >
          <Input.Password placeholder="确认新密码" autoComplete="rel_new_password" />
        </Form.Item>
        <Button
          icon={<Icon.CheckOutlined />}
          type="primary"
          block={true}
          loading={updating.state.value}
          onClick={handleSubmit}
        >
          保存
        </Button>
      </Form>
    </Spin>
  )
}
