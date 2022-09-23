import React from 'react'
import { Ref, useWatch, useRef } from 'veact'
import { useLoading } from 'veact-use'
import {
  Form,
  Typography,
  Input,
  InputNumber,
  Button,
  Divider,
  Select,
  Drawer,
  Space,
  Spin,
} from 'antd'
import * as Icon from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { UniversalEditor } from '@/components/common/UniversalEditor/lazy'
import { FormDataKeyValue } from '@/components/common/FormDataKeyValue'
import { IPLocation } from '@/components/common/IPLocation'
import { getArticle } from '@/store/article'
import { Article } from '@/constants/article'
import { Comment, commentStates, COMMENT_GUESTBOOK_POST_ID } from '@/constants/comment'
import { stringToYMD } from '@/transforms/date'
import { getBlogURLByPostID } from '@/transforms/url'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'
import { CommentAvatar } from './Avatar'

export interface EditDrawerProps {
  loading: boolean
  visible: Ref<boolean>
  comment: Ref<Comment | null>
  onSubmit(comment: Comment): void
  onCancel(): void
}

export const EditDrawer: React.FC<EditDrawerProps> = (props) => {
  const [form] = Form.useForm<Comment>()
  const loadingComment = useLoading()
  const commentArticle = useRef<Article | null>(null)
  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit(formValue)
    })
  }

  const fetchArticle = (articleId: number) => {
    loadingComment.promise(getArticle(articleId)).then((result) => {
      commentArticle.value = result
    })
  }

  useWatch(props.visible, (visible) => {
    if (visible) {
      const targetComment = props.comment.value
      form.setFieldsValue(targetComment || {})
      if (targetComment) {
        if (targetComment.post_id !== COMMENT_GUESTBOOK_POST_ID) {
          fetchArticle(targetComment.post_id)
        }
      }
    } else {
      form.resetFields()
    }
  })

  return (
    <Drawer
      width="46rem"
      title="评论详情"
      visible={props.visible.value}
      onClose={props.onCancel}
      destroyOnClose={true}
    >
      <Spin spinning={props.loading}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          scrollToFirstError={true}
          colon={false}
          form={form}
        >
          <Form.Item label="ID">
            <Typography.Text copyable={true}>{props.comment.value?.id}</Typography.Text>
            <Divider type="vertical" />
            <Typography.Text copyable={true}>{props.comment.value?._id}</Typography.Text>
          </Form.Item>
          <Form.Item label="发布于">{stringToYMD(props.comment.value?.create_at!)}</Form.Item>
          <Form.Item label="最后修改于">{stringToYMD(props.comment.value?.update_at!)}</Form.Item>
          <Form.Item label="用户头像">
            <CommentAvatar size="large" comment={props.comment.value!} />
          </Form.Item>
          <Form.Item
            name={['author', 'name']}
            label="用户昵称"
            rules={[{ required: true, message: '必填' }]}
          >
            <Input prefix={<Icon.UserOutlined />} />
          </Form.Item>
          <Form.Item
            name={['author', 'email']}
            label="用户邮箱"
            rules={[
              {
                message: '请输入正确的邮箱',
                type: 'email',
              },
            ]}
          >
            <Input prefix={<Icon.MailOutlined />} placeholder="email" type="email" />
          </Form.Item>
          <Form.Item
            name={['author', 'site']}
            label="用户网址"
            rules={[
              {
                message: '请输入正确的 URL',
                type: 'url',
              },
            ]}
          >
            <Input
              prefix={<Icon.LinkOutlined />}
              type="url"
              placeholder="URL"
              suffix={
                <Icon.SendOutlined
                  onClick={() => {
                    const url = props.comment.value?.author.site
                    if (url) {
                      window.open(url)
                    }
                  }}
                />
              }
            />
          </Form.Item>
          <Form.Item label="IP 地址">
            <UniversalText text={props.comment.value?.ip} copyable={true} />
          </Form.Item>
          <Form.Item label="IP 地理位置">
            <IPLocation data={props.comment.value?.ip_location} fullname={true} />
          </Form.Item>
          <Form.Item label="终端">
            <UniversalText
              text={parseBrowser(props.comment.value?.agent!)}
              placeholder="未知浏览器"
            />
            <Divider type="vertical" />
            <UniversalText text={parseOS(props.comment.value?.agent!)} placeholder="未知系统" />
            <Divider type="vertical" />
            <UniversalText
              text={parseDevice(props.comment.value?.agent!)}
              placeholder="未知设备"
            />
          </Form.Item>
          <Form.Item name="likes" label="被赞" rules={[{ required: true, message: '必填' }]}>
            <InputNumber addonBefore={<Icon.LikeOutlined />} placeholder="多少" />
          </Form.Item>
          <Form.Item name="dislikes" label="被踩" rules={[{ required: true, message: '必填' }]}>
            <InputNumber addonBefore={<Icon.DislikeOutlined />} placeholder="多少" />
          </Form.Item>
          <Form.Item label="宿主页面">
            <Button
              type="link"
              target="_blank"
              icon={<Icon.LinkOutlined />}
              href={getBlogURLByPostID(props.comment.value?.post_id!)}
            >
              {props.comment.value?.post_id === COMMENT_GUESTBOOK_POST_ID
                ? '留言板'
                : commentArticle.value?.title}
              <Divider type="vertical" />
              <span>#{props.comment.value?.id}</span>
            </Button>
          </Form.Item>
          {Boolean(props.comment.value?.pid) && (
            <Form.Item label="父级评论">
              <Typography.Text strong>#{props.comment.value?.pid}</Typography.Text>
            </Form.Item>
          )}
          <Form.Item
            name="state"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              placeholder="选择状态"
              options={commentStates.map((state) => {
                return {
                  value: state.id,
                  label: (
                    <Space>
                      {state.icon}
                      {state.name}
                    </Space>
                  ),
                }
              })}
            />
          </Form.Item>
          <Form.Item
            label="评论内容"
            name="content"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <UniversalEditor
              disabledMinimap={true}
              disabledCacheDraft={true}
              minRows={14}
              maxRows={18}
            />
          </Form.Item>
          <Form.Item
            label="自定义扩展"
            extra="可以为当前评论增加自定义扩展属性"
            shouldUpdate={true}
          >
            <FormDataKeyValue fieldName="extends" />
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
      </Spin>
    </Drawer>
  )
}
