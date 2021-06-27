import React from 'react';
import { Button, Input, Form, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import styles from './style.module.less';

export interface FormDataExtendProps {
  fieldName: string;
}
export const FormDataExtend: React.FC<FormDataExtendProps> = (props) => {
  return (
    <Form.List name={props.fieldName}>
      {(extendsData, { add, remove }) => (
        <>
          {extendsData.map((extend, index) => (
            <Space size="middle" key={index} className={styles.inputGroup}>
              <Form.Item
                {...extend}
                noStyle={true}
                name={[extend.name, 'name']}
                fieldKey={[extend.fieldKey, 'name']}
                required={true}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                {...extend}
                noStyle={true}
                name={[extend.name, 'value']}
                fieldKey={[extend.fieldKey, 'value']}
                required={true}
              >
                <Input placeholder="Value" />
              </Form.Item>
              <Button
                icon={<DeleteOutlined />}
                danger={true}
                type="dashed"
                onClick={() => remove(extend.name)}
              />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              增加扩展
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
