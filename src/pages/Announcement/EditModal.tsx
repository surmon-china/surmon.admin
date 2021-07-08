/**
 * @file Announcement editor
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react';
import { Ref, useWatch } from '@/veact';
import { Form, Select, Modal, Space, Divider, Typography } from 'antd';
import { UniversalEditor } from '@/components/common/UniversalEditor';
import { Announcement } from '@/constants/announcement';
import { ps } from '@/constants/publish';
import { stringToYMD } from '@/transformers/date';
import { STATE_IDS } from './index';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

export interface EditModalProps {
  title: string;
  loading: boolean;
  visible: Ref<boolean>;
  announcement: Ref<Announcement | null>;
  onSubmit(announcement: Announcement): void;
  onCancel(): void;
}

export const EditModal: React.FC<EditModalProps> = (props) => {
  const [form] = Form.useForm<Announcement>();
  const handleSubmit = () => {
    form.validateFields().then(props.onSubmit);
  };

  useWatch(
    () => props.visible.value,
    (visible) => {
      visible
        ? form.setFieldsValue(props.announcement.value || {})
        : form.resetFields();
    }
  );

  return (
    <Modal
      width={680}
      title={props.title}
      confirmLoading={props.loading}
      visible={props.visible.value}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      centered={true}
      okText="提交"
    >
      <Form {...formLayout} colon={false} form={form}>
        {props.announcement.value && (
          <>
            <Form.Item label="ID">
              <Typography.Text copyable={true}>
                {props.announcement.value?.id}
              </Typography.Text>
              <Divider type="vertical" />
              <Typography.Text copyable={true}>
                {props.announcement.value?._id}
              </Typography.Text>
            </Form.Item>
            <Form.Item label="发布于">
              {stringToYMD(props.announcement.value?.create_at)}
            </Form.Item>
            <Form.Item label="最后修改于">
              {stringToYMD(props.announcement.value?.update_at)}
            </Form.Item>
          </>
        )}
        <Form.Item
          label="发布状态"
          name="state"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select
            placeholder="选择状态"
            options={STATE_IDS.map((state) => {
              const target = ps(state);
              return {
                value: target.id,
                label: (
                  <Space>
                    {target.icon}
                    {target.name}
                  </Space>
                ),
              };
            })}
          />
        </Form.Item>
        <Form.Item
          label="公告内容"
          name="content"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <UniversalEditor
            disabledMinimap={true}
            disabledToolbar={true}
            disabledCacheDraft={true}
            minRows={10}
            maxRows={18}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
