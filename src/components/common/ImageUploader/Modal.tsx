/**
 * @desc General image uploader
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useEffect } from 'react'
import { useRef } from 'veact'
import { Modal, Space, Button } from 'antd'
import { FileImageOutlined } from '@ant-design/icons'

import { ImageUploader } from './index'

export interface ImageUploaderModalProps {
  initValue?: string
  visible?: boolean
  onClose?(): void
}
export const ImageUploaderModal: React.FC<ImageUploaderModalProps> = (props) => {
  const value = useRef(props.initValue || '')

  useEffect(() => {
    if (!props.visible) {
      value.value = ''
    }
  }, [props.visible])

  return (
    <Modal
      centered={true}
      closable={false}
      visible={props.visible}
      title={
        <Space>
          <FileImageOutlined />
          上传图片
        </Space>
      }
      footer={
        <Button block={true} type="link" onClick={props.onClose}>
          OK
        </Button>
      }
    >
      <ImageUploader
        value={value.value}
        onChange={(newValue) => {
          value.value = newValue
        }}
      />
    </Modal>
  )
}
