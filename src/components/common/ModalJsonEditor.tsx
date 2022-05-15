import React from 'react'
import { Modal } from 'antd'
import { UniversalEditor, UEditorLanguage } from '@/components/common/UniversalEditor/lazy'

export function openJSONEditor<T = any>(title: string, initVaue: T, callback: (data: T) => any) {
  let data: any = JSON.stringify(initVaue, null, 2)
  return Modal.confirm({
    width: '60vw',
    style: {
      maxHeight: '60vh',
    },
    title: title,
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
        />
      </div>
    ),
    onOk() {
      return callback(JSON.parse(data))
    },
  })
}
