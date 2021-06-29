import React from 'react';
import { Button, Form, Select, Input, Divider, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { CheckOutlined } from '@ant-design/icons';

import { publishStates } from '@/constants/publish-state';
import { articleOrigins } from '@/constants/article/origin';
import { articlePublics, ArticlePublic } from '@/constants/article/public';
import { StateFormModel } from '.';

const requiredRule = {
  message: '必选',
  required: true,
};

export interface StateFormProps {
  form: FormInstance<StateFormModel>;
  submitting: boolean;
  onSubmit(): void;
}
export const StateForm: React.FC<StateFormProps> = (props) => {
  return (
    <Form
      scrollToFirstError={true}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 13, offset: 1 }}
      colon={false}
      form={props.form}
    >
      <Form.Item required={true} name="state" label="发布状态" rules={[requiredRule]}>
        <Select
          placeholder="文章发布状态"
          options={publishStates.map((state) => {
            return {
              value: state.id,
              label: (
                <Space>
                  {state.icon}
                  {state.name}
                </Space>
              ),
            };
          })}
        />
      </Form.Item>
      <Form.Item required={true} name="origin" label="文章来源" rules={[requiredRule]}>
        <Select
          placeholder="文章来源"
          options={articleOrigins.map((state) => {
            return {
              value: state.id,
              label: (
                <Space>
                  {state.icon}
                  {state.name}
                </Space>
              ),
            };
          })}
        />
      </Form.Item>
      <Form.Item required={true} name="public" label="公开类型" rules={[requiredRule]}>
        <Select
          placeholder="文章公开类型"
          options={articlePublics.map((state) => {
            return {
              value: state.id,
              label: (
                <Space>
                  {state.icon}
                  {state.name}
                </Space>
              ),
            };
          })}
        />
      </Form.Item>
      <Form.Item noStyle={true} shouldUpdate={true}>
        {(values: FormInstance<StateFormModel>) => (
          <Form.Item name="password" label="文章密码">
            <Input.Password
              placeholder="输入文章密码"
              disabled={values.getFieldValue('public') !== ArticlePublic.Password}
            />
          </Form.Item>
        )}
      </Form.Item>
      <Divider />
      <Button
        type="primary"
        block={true}
        icon={<CheckOutlined />}
        loading={props.submitting}
        onClick={props.onSubmit}
      >
        提交
      </Button>
    </Form>
  );
};
