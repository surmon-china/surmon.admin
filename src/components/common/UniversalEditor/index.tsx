/**
 * @desc Lazy universal editor
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Card } from 'antd'
import type { UniversalEditorProps } from './Editor'

export * from './shared'
export type { UniversalEditorProps } from './Editor'

const EditorComponent = React.lazy(() => {
  return import('./Editor').then((result) => {
    return { default: result.UniversalEditor }
  })
})

export const UniversalEditor: React.FC<UniversalEditorProps> = (props) => {
  return (
    <React.Suspense fallback={<Card size="small" loading />}>
      <EditorComponent {...props} />
    </React.Suspense>
  )
}
