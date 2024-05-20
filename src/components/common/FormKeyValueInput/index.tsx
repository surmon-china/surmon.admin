/**
 * @desc General key value data form
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Button, Input, Form, Space } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Trans } from '@/i18n'

import styles from './style.module.less'

export interface FormKeyValueInputProps {
  fieldName: string
}

export const FormKeyValueInput: React.FC<FormKeyValueInputProps> = (props) => (
  <Form.List name={props.fieldName}>
    {(extendsData, { add, remove }) => (
      <Space direction="vertical" size="middle" className={styles.inputWrapper}>
        {extendsData.map((extend) => (
          <Space size="middle" key={extend.name} className={styles.inputGroup}>
            <Form.Item noStyle={true} required={true} name={[extend.name, 'name']}>
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item noStyle={true} required={true} name={[extend.name, 'value']}>
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
        <Button block type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
          <span>
            <Trans i18nKey="component.form_key_value.add" />
          </span>
        </Button>
      </Space>
    )}
  </Form.List>
)
