import React from 'react'
import moment from 'moment'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import {
  Modal,
  Spin,
  Button,
  Form,
  Select,
  Input,
  Divider,
  Space,
  Typography,
  FormInstance,
} from 'antd'
import * as Icon from '@ant-design/icons'
import { UniversalEditor, UEditorLanguage } from '@/components/common/UniversalEditor/lazy'
import { MultipleUploader } from '@/components/common/ImageUploader'
import { getTags } from '@/store/tag'
import { Tag } from '@/constants/tag'
import { BLOG_ARTICLE_URL_PREFIX } from '@/transforms/url'
import { BaseFormModel } from './'

interface TagSelectProps {
  value?: Array<string>
  onChange?(value: Array<string>): void
}
const TagSelect: React.FC<TagSelectProps> = (props) => {
  const tagsLoading = useLoading()
  const tags = useRef<Array<Tag>>([])
  const fetchTags = () => {
    tagsLoading.promise(getTags({ per_page: 50 })).then((result) => {
      tags.value = result.data
    })
  }

  const values = props.value || []
  const handleClick = (tag: Tag, checked: boolean) => {
    const tagID = tag._id!
    const tagIDs = checked ? [...values, tagID] : values.filter((t) => t !== tagID)
    props.onChange?.(tagIDs)
  }

  onMounted(() => {
    fetchTags()
  })

  return (
    <Spin spinning={tagsLoading.state.value}>
      <Space wrap={true} size={[12, 12]}>
        {!tags.value.length ? (
          <Typography.Text type="secondary">无数据</Typography.Text>
        ) : (
          tags.value.map((tag) => {
            const isChecked = values.includes(tag._id!)
            return (
              <Button
                size="small"
                key={tag._id!}
                type={isChecked ? 'primary' : 'default'}
                icon={isChecked ? <Icon.CheckCircleOutlined /> : <Icon.TagOutlined />}
                onClick={() => handleClick(tag, !isChecked)}
              >
                {tag.name}
              </Button>
            )
          })
        )}
        <Divider type="vertical" />
        <Button
          size="small"
          type="dashed"
          icon={<Icon.ReloadOutlined />}
          loading={tagsLoading.state.value}
          onClick={fetchTags}
        >
          刷新列表
        </Button>
      </Space>
    </Spin>
  )
}

export interface MainFormProps {
  form: FormInstance<BaseFormModel>
  editorCacheID?: string
}
export const MainForm: React.FC<MainFormProps> = (props) => {
  const isVisibleUploaderModal = useRef(false)

  return (
    <>
      <Form
        scrollToFirstError={true}
        colon={false}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        form={props.form}
      >
        <Form.Item
          label="别名"
          name="slug"
          wrapperCol={{ span: 12 }}
          rules={[
            {
              pattern: /^[a-zA-Z0-9-_]+$/,
              message: '仅支持 英文、数字、_、-',
            },
          ]}
        >
          <Input
            addonBefore={BLOG_ARTICLE_URL_PREFIX}
            placeholder="article-title"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item
          label="标题"
          name="title"
          wrapperCol={{ span: 12 }}
          rules={[
            {
              required: true,
              message: '请输入标题',
            },
          ]}
        >
          <Input placeholder="文章标题" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          required={true}
          rules={[
            {
              required: true,
              message: '请输入标题',
            },
          ]}
        >
          <Input.TextArea rows={4} placeholder="文章描述" />
        </Form.Item>
        <Form.Item
          label="关键词"
          name="keywords"
          required={true}
          rules={[
            {
              message: '至少应该有一个关键词',
              validator(_, value: string[]) {
                return Boolean(value?.length) ? Promise.resolve() : Promise.reject()
              },
            },
          ]}
        >
          <Select placeholder="输入关键词后回车" mode="tags" />
        </Form.Item>
        <Form.Item label="标签" name="tag">
          <TagSelect />
        </Form.Item>
        <br />
        <Form.Item
          label="内容"
          name="content"
          required={true}
          rules={[
            {
              required: true,
              message: '请输入文章内容',
            },
          ]}
        >
          <UniversalEditor
            formStatus={true}
            minRows={28}
            eid={props.editorCacheID}
            placeholder="输入文章内容..."
            renderToolbarExtra={(language) => {
              if (language === UEditorLanguage.Markdown) {
                return (
                  <Button
                    size="small"
                    icon={<Icon.CloudUploadOutlined />}
                    onClick={() => {
                      isVisibleUploaderModal.value = true
                    }}
                  />
                )
              }
            }}
          />
        </Form.Item>
      </Form>
      <Modal
        centered={true}
        closable={false}
        visible={isVisibleUploaderModal.value}
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        title={
          <Space>
            <Icon.FileImageOutlined />
            图片上传器
          </Space>
        }
        footer={
          <Button
            block={true}
            type="link"
            onClick={() => {
              isVisibleUploaderModal.value = false
            }}
          >
            OK
          </Button>
        }
      >
        <MultipleUploader directory={`nodepress/${moment().format('YYYY-MM-DD')}`} />
      </Modal>
    </>
  )
}
