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
