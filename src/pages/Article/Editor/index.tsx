import React from 'react';
import { Ref, useWatch, onMounted } from '@/veact';
import { Button, Card, Row, Col, Modal, Form, message, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { DeleteOutlined } from '@ant-design/icons';

import { APP_LAYOUT_GUTTER_SIZE } from '@/config';
import { ImageUploader } from '@/components/common/ImageUploader';
import { FormDataExtend } from '@/components/common/FormDataExtend';
import { Article } from '@/constants/article';
import { PublishState } from '@/constants/publish-state';
import { ArticleOrigin } from '@/constants/article/origin';
import { ArticlePublic } from '@/constants/article/public';
import { MainForm } from './Main';
import { CategoryForm } from './Category';
import { StateForm } from './State';

import styles from './style.module.less';

export type BaseFormModel = Partial<
  Pick<Article, 'tag' | 'title' | 'content' | 'keywords' | 'description'>
>;
export type CategoryFormModel = Pick<Article, 'category'>;
export type ThumbFormModel = Pick<Article, 'thumb'>;
export type ExtendFormModel = Pick<Article, 'extends'>;
export type StateFormModel = Pick<Article, 'state' | 'origin' | 'public' | 'password'>;

const DEFAULT_ARTICLE: Article = Object.freeze({
  title: '',
  description: '',
  keywords: [],
  content: '',
  thumb: '',
  origin: ArticleOrigin.Original,
  state: PublishState.Published,
  public: ArticlePublic.Public,
  password: '',
  tag: [],
  category: [],
  extends: [],
});

export interface ArticleEditorProps {
  title: string;
  loading: boolean;
  submitting: boolean;
  article?: Ref<Article | null>;
  onDelete?(): Promise<any>;
  onSubmit(article: Article): any;
}
export const ArticleEditor: React.FC<ArticleEditorProps> = (props) => {
  const [mainForm] = useForm<BaseFormModel>();
  const [categoryFormModel] = useForm<CategoryFormModel>();
  const [thumbFormModel] = useForm<ThumbFormModel>();
  const [extendFormModel] = useForm<ExtendFormModel>();
  const [stateFormModel] = useForm<StateFormModel>();

  const setFormsValue = (formValue: Article) => {
    mainForm.setFieldsValue(formValue);
    categoryFormModel.setFieldsValue(formValue);
    thumbFormModel.setFieldsValue(formValue);
    extendFormModel.setFieldsValue(formValue);
    stateFormModel.setFieldsValue(formValue);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...props.article?.value,
        ...(await mainForm.validateFields()),
        ...(await categoryFormModel.validateFields()),
        ...(await thumbFormModel.validateFields()),
        ...(await extendFormModel.validateFields()),
        ...(await stateFormModel.validateFields()),
      };
      props.onSubmit?.(data as Article);
    } catch (error) {
      console.warn('Article 提交错误：', error);
      message.error(`请检查表单：${JSON.stringify(error)}`);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: `你确定要彻底删除文章 《${props.article!.value!.title}》 吗？`,
      content: '该行为是物理删除，不可恢复！',
      onOk: props.onDelete,
      okButtonProps: {
        danger: true,
        type: 'ghost',
      },
    });
  };

  useWatch(
    () => props.article?.value,
    (article) => {
      if (article) {
        setFormsValue(article);
      }
    }
  );

  onMounted(() => {
    setFormsValue(DEFAULT_ARTICLE);
  });

  return (
    <div className={styles.articleeEitor}>
      <Row gutter={APP_LAYOUT_GUTTER_SIZE}>
        <Col span={17}>
          <Card
            title={props.title}
            bordered={false}
            className={styles.articleeEitor}
            extra={
              <Button
                type="dashed"
                size="small"
                danger={true}
                icon={<DeleteOutlined />}
                disabled={!props.article}
                onClick={handleDelete}
              >
                删除文章
              </Button>
            }
          >
            <Spin spinning={props.loading}>
              <MainForm form={mainForm} />
            </Spin>
          </Card>
        </Col>
        <Col span={7}>
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
                  <Form scrollToFirstError={true} form={thumbFormModel}>
                    <Form.Item noStyle={true} name="thumb">
                      <ImageUploader />
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
                      <FormDataExtend fieldName="extends" />
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
  );
};
