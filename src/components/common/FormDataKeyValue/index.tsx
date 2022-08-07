/**
 * @desc DataExtend form
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Button, Input, Form, Space } from 'antd'
import * as Icon from '@ant-design/icons'

import styles from './style.module.less'

export interface FormDataKeyValueProps {
  fieldName: string
}
export const FormDataKeyValue: React.FC<FormDataKeyValueProps> = (props) => {
  return (
    <Form.List name={props.fieldName}>
      {(extendsData, { add, remove }) => (
        <div>
          {extendsData.map((extend) => (
            <Space size="middle" key={extend.name} className={styles.inputGroup}>
              <Form.Item noStyle={true} required={true} name={[extend.name, 'name']}>
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item noStyle={true} required={true} name={[extend.name, 'value']}>
                <Input placeholder="Value" />
              </Form.Item>
              <Button
                icon={<Icon.DeleteOutlined />}
                danger={true}
                type="dashed"
                onClick={() => remove(extend.name)}
              />
            </Space>
          ))}
          <Button type="dashed" block={true} icon={<Icon.PlusOutlined />} onClick={() => add()}>
            增加数据
          </Button>
        </div>
      )}
    </Form.List>
  )
}
