import React from 'react'
import { Ref, useWatch, useRef } from 'veact'
import {
  Form,
  Typography,
  Input,
  InputNumber,
  Avatar,
  Switch,
  Button,
  Divider,
  Select,
  Drawer,
  Space,
  Spin,
} from 'antd'
import {
  UserOutlined,
  CheckOutlined,
  MailOutlined,
  SendOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { UniversalEditor } from '@/components/common/UniversalEditor'
import { FormDataExtend } from '@/components/common/FormDataExtend'
import { useLoading } from 'veact-use'
import { getComment } from '@/store/comment'
import { getArticle } from '@/store/article'
import { Comment, commentStates, COMMENT_GUESTBOOK_ID } from '@/constants/comment'
import { Article } from '@/constants/article'
import { stringToYMD } from '@/transforms/date'
import { autoCommentAvatar } from '@/transforms/avatar'
import { getBlogGuestbookUrl, getBlogArticleUrl } from '@/transforms/url'
import { parseBrowser, parseOS } from '@/transforms/ua'

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
  const parentComment = useRef<Comment | null>(null)
  const commentArticle = useRef<Article | null>(null)
  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit(formValue)
    })
  }

  const fetchParentComment = (pid: number) => {
    loadingComment.promise(getComment(pid)).then((result) => {
      parentComment.value = result
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
        if (!!targetComment.pid) {
          fetchParentComment(targetComment.pid!)
        }
        if (targetComment.post_id !== COMMENT_GUESTBOOK_ID) {
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
            <Typography.Text copyable={true}>
              {props.comment.value?._id}
            </Typography.Text>
          </Form.Item>
          <Form.Item label="发布于">
            {stringToYMD(props.comment.value?.create_at!)}
          </Form.Item>
          <Form.Item label="最后修改于">
            {stringToYMD(props.comment.value?.update_at!)}
          </Form.Item>
          <Form.Item label="用户头像">
            <Avatar
              shape="square"
              size="large"
              src={props.comment.value ? autoCommentAvatar(props.comment.value) : ''}
            />
          </Form.Item>
          <Form.Item
            name={['author', 'name']}
            label="用户昵称"
            rules={[{ required: true, message: '必填' }]}
          >
            <Input prefix={<UserOutlined />} />
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
            <Input prefix={<MailOutlined />} placeholder="email" type="email" />
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
              prefix={<LinkOutlined />}
              type="url"
              placeholder="URL"
              suffix={
                <SendOutlined
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
          <Form.Item label="IP / 地址">
            <Typography.Text copyable={true}>
              {props.comment.value?.ip || '-'}
            </Typography.Text>
            <Divider type="vertical" />
            {props.comment.value?.ip_location?.country || '-'}
            <span> - </span>
            {props.comment.value?.ip_location?.city || '-'}
          </Form.Item>
          <Form.Item label="终端">
            {parseBrowser(props.comment.value?.agent!)}
            <Divider type="vertical" />
            {parseOS(props.comment.value?.agent!)}
          </Form.Item>
          <Form.Item
            name="likes"
            label="被喜欢"
            rules={[{ required: true, message: '必填' }]}
          >
            <InputNumber placeholder="多少" />
          </Form.Item>
          <Form.Item label="宿主文章">
            <Button
              type="link"
              target="_blank"
              icon={<LinkOutlined />}
              href={
                props.comment.value?.post_id === COMMENT_GUESTBOOK_ID
                  ? getBlogGuestbookUrl()
                  : getBlogArticleUrl(
                      commentArticle.value?.id!,
                      commentArticle.value?.slug
                    )
              }
            >
              {props.comment.value?.post_id === COMMENT_GUESTBOOK_ID
                ? '留言板'
                : commentArticle.value?.title}
              <Divider type="vertical" />#{props.comment.value?.id}
            </Button>
          </Form.Item>
          {Boolean(props.comment.value?.pid) && (
            <Form.Item label="父级评论">
              <p>#{props.comment.value?.pid}</p>
              <Typography.Paragraph>
                <blockquote>{parentComment.value?.content}</blockquote>
              </Typography.Paragraph>
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
            <FormDataExtend fieldName="extends" />
          </Form.Item>
          <Form.Item label=" ">
            <Button
              icon={<CheckOutlined />}
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
