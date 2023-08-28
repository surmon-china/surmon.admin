import React from 'react'
import { Modal, message } from 'antd'
import { UniversalEditor, UEditorLanguage } from '@/components/common/UniversalEditor'

export function openJSONEditor<T = string>(
  title: string,
  initVaue: T,
  callback: (data: T) => any
) {
  let data: string | undefined = JSON.stringify(initVaue, null, 2)
  return Modal.confirm({
    width: '60vw',
    title,
    icon: null,
    centered: true,
    closable: true,
    okText: '提交更新',
    content: (
      <div>
        <br />
        <UniversalEditor
          value={data}
          onChange={(value) => (data = value)}
          defaultLanguage={UEditorLanguage.JSON}
          disabledToolbar={true}
          disabledMinimap={true}
          disabledCacheDraft={true}
          rows={20}
        />
      </div>
    ),
    onOk() {
      try {
        JSON.parse(data!)
        return callback(JSON.parse(data!))
      } catch (error) {
        message.error('JSON 格式错误')
        return Promise.reject('JSON 格式错误')
      }
    }
  })
}
