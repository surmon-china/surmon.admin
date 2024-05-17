/**
 * @file Article editor form
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Ref, useWatch, onMounted } from 'veact'
import { Card, Row, Col, Form, message, Spin, Button } from 'antd'
import * as Icon from '@ant-design/icons'
import { APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { ImageUploader } from '@/components/common/ImageUploader'
import { FormKeyValueInput } from '@/components/common/FormKeyValueInput'
import { openJSONEditor } from '@/components/common/ModalJsonEditor'
import { Article, ArticleOrigin, ArticlePublic, ArticleLanguage } from '@/constants/article'
import { PublishState } from '@/constants/publish'
import { useLocale } from '@/contexts/Locale'
import { useTheme } from '@/contexts/Theme'
import { useTranslation } from '@/i18n'
import { scrollTo } from '@/services/scroller'
import { MainForm } from './MainForm'
import { CategoriesForm } from './CategoriesForm'
import { StatesForm } from './StatesForm'

import styles from './style.module.less'

export type MainFormModel = Partial<
  Pick<Article, 'slug' | 'tags' | 'title' | 'content' | 'keywords' | 'description'>
>
export type CategoriesFormModel = Pick<Article, 'categories'>
export type ThumbnailFormModel = Pick<Article, 'thumbnail'>
export type ExtendsFormModel = Pick<Article, 'extends'>
export type StatesFormModel = Pick<Article, 'state' | 'origin' | 'public'>

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
  featured: false,
  disabled_comments: false,
  tags: [],
  categories: [],
  extends: []
})

export interface ArticleEditorProps {
  extra?: React.ReactNode
  loading: boolean
  submitting: boolean
  article?: Ref<Article | null>
  editorCacheID?: string
  onSubmit(article: Article): any
}

export const ArticleEditor: React.FC<ArticleEditorProps> = (props) => {
  const { i18n } = useTranslation()
  const { language } = useLocale()
  const { theme } = useTheme()
  const [mainForm] = Form.useForm<MainFormModel>()
  const [categoriesFormModel] = Form.useForm<CategoriesFormModel>()
  const [thumbnailFormModel] = Form.useForm<ThumbnailFormModel>()
  const [extendsFormModel] = Form.useForm<ExtendsFormModel>()
  const [statesFormModel] = Form.useForm<StatesFormModel>()

  const setFormsValue = (formValue: Article) => {
    mainForm.setFieldsValue(formValue)
    categoriesFormModel.setFieldsValue(formValue)
    thumbnailFormModel.setFieldsValue(formValue)
    extendsFormModel.setFieldsValue(formValue)
    statesFormModel.setFieldsValue(formValue)
  }

  const handleSubmit = async () => {
    try {
      const data = {
        ...props.article?.value,
        ...(await mainForm.validateFields()),
        ...(await categoriesFormModel.validateFields()),
        ...(await thumbnailFormModel.validateFields()),
        ...(await extendsFormModel.validateFields()),
        ...(await statesFormModel.validateFields())
      }
      data.slug = data.slug || null
      props.onSubmit?.(data as Article)
    } catch (error) {
      console.warn('Article 提交错误：', error)
      message.error('请检查表单中的不合法项')
    }
  }

  const handleEditExtendsAsJSON = () => {
    openJSONEditor({
      title: '以 JSON 编辑自定义扩展',
      initTheme: theme,
      initLanguage: language,
      initValue: extendsFormModel.getFieldsValue(),
      callback: (newValue) => extendsFormModel.setFieldsValue(newValue)
    })
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
            title={i18n.t('page.article.editor.content')}
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
              <Card title={i18n.t('page.article.editor.categories')} bordered={false}>
                <Spin spinning={props.loading}>
                  <CategoriesForm form={categoriesFormModel} />
                </Spin>
              </Card>
            </Col>
            <Col span={24}>
              <Card title={i18n.t('page.article.editor.thumbnail')} bordered={false}>
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
              <Card
                title={i18n.t('page.article.editor.extends')}
                bordered={false}
                extra={
                  <Button
                    type="link"
                    size="small"
                    icon={<Icon.EditOutlined />}
                    disabled={props.loading}
                    onClick={handleEditExtendsAsJSON}
                  >
                    以 JSON 编辑
                  </Button>
                }
              >
                <Spin spinning={props.loading}>
                  <Form scrollToFirstError={true} form={extendsFormModel}>
                    <Form.Item noStyle={true} shouldUpdate={true}>
                      <FormKeyValueInput fieldName="extends" />
                    </Form.Item>
                  </Form>
                </Spin>
              </Card>
            </Col>
            <Col span={24}>
              <Card title={i18n.t('page.article.editor.states')} bordered={false}>
                <Spin spinning={props.loading}>
                  <StatesForm
                    form={statesFormModel}
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
