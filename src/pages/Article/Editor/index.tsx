/**
 * @file Article editor form
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Ref, useWatch, onMounted } from 'veact'
import { Card, Row, Col, Form, message, Spin } from 'antd'
import { APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { ImageUploader } from '@/components/common/ImageUploader'
import { FormDataKeyValue } from '@/components/common/FormDataKeyValue'
import { Article } from '@/constants/article'
import { PublishState } from '@/constants/publish'
import { ArticleOrigin } from '@/constants/article/origin'
import { ArticlePublic } from '@/constants/article/public'
import { ArticleLanguage } from '@/constants/article/language'
import { scrollTo } from '@/services/scroller'
import { MainForm } from './Main'
import { CategoryForm } from './Category'
import { StateForm } from './State'

import styles from './style.module.less'

export type BaseFormModel = Partial<
  Pick<Article, 'slug' | 'tags' | 'title' | 'content' | 'keywords' | 'description'>
>
export type CategoryFormModel = Pick<Article, 'categories'>
export type ThumbnailFormModel = Pick<Article, 'thumbnail'>
export type ExtendFormModel = Pick<Article, 'extends'>
export type StateFormModel = Pick<Article, 'state' | 'origin' | 'public'>

const DEFAULT_ARTICLE: Article = Object.freeze({
  slug: null,
  title: '',
  description: '',
  keywords: [],
  content: '',
  thumbnail: '',
  origin: ArticleOrigin.Original,
  state: PublishState.Published,
  public: ArticlePublic.Public,
  lang: ArticleLanguage.Chinese,
  disabled_comments: false,
  tags: [],
  categories: [],
  extends: []
})

export interface ArticleEditorProps {
  title: string
  extra?: React.ReactNode
  loading: boolean
  submitting: boolean
  article?: Ref<Article | null>
  editorCacheID?: string
  onSubmit(article: Article): any
}
export const ArticleEditor: React.FC<ArticleEditorProps> = (props) => {
  const [mainForm] = Form.useForm<BaseFormModel>()
  const [categoryFormModel] = Form.useForm<CategoryFormModel>()
  const [thumbnailFormModel] = Form.useForm<ThumbnailFormModel>()
  const [extendFormModel] = Form.useForm<ExtendFormModel>()
  const [stateFormModel] = Form.useForm<StateFormModel>()

  const setFormsValue = (formValue: Article) => {
    mainForm.setFieldsValue(formValue)
    categoryFormModel.setFieldsValue(formValue)
    thumbnailFormModel.setFieldsValue(formValue)
    extendFormModel.setFieldsValue(formValue)
    stateFormModel.setFieldsValue(formValue)
  }

  const handleSubmit = async () => {
    try {
      const data = {
        ...props.article?.value,
        ...(await mainForm.validateFields()),
        ...(await categoryFormModel.validateFields()),
        ...(await thumbnailFormModel.validateFields()),
        ...(await extendFormModel.validateFields()),
        ...(await stateFormModel.validateFields())
      }
      data.slug = data.slug || null
      props.onSubmit?.(data as Article)
    } catch (error) {
      console.warn('Article 提交错误：', error)
      message.error('请检查表单中的不合法项')
    }
  }

  useWatch(
    () => props.article?.value,
    (article) => {
      if (article) {
        setFormsValue(article)
      }
    }
  )

  onMounted(() => {
    setFormsValue(DEFAULT_ARTICLE)
    scrollTo(document.body)
  })

  return (
    <div className={styles.articleeEitor}>
      <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
        <Col xs={24} lg={17}>
          <Card
            bordered={false}
            title={props.title}
            className={styles.articleeEitor}
            extra={props.extra}
          >
            <Spin spinning={props.loading}>
              <MainForm form={mainForm} editorCacheID={props.editorCacheID} />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={7}>
          <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
            <Col span={24}>
              <Card title="分类目录" bordered={false}>
                <Spin spinning={props.loading}>
                  <CategoryForm form={categoryFormModel} />
                </Spin>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="缩略图" bordered={false}>
                <Spin spinning={props.loading}>
                  <Form scrollToFirstError={true} form={thumbnailFormModel}>
                    <Form.Item noStyle={true} name="thumbnail">
                      <ImageUploader directory="thumbnail" />
                    </Form.Item>
                  </Form>
                </Spin>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="自定义扩展" bordered={false}>
                <Spin spinning={props.loading}>
                  <Form scrollToFirstError={true} form={extendFormModel}>
                    <Form.Item noStyle={true} shouldUpdate={true}>
                      <FormDataKeyValue fieldName="extends" />
                    </Form.Item>
                  </Form>
                </Spin>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="发布选项" bordered={false}>
                <Spin spinning={props.loading}>
                  <StateForm
                    form={stateFormModel}
                    submitting={props.submitting}
                    onSubmit={handleSubmit}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
