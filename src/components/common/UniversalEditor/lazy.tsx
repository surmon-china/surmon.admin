/**
 * @desc Lazy universal editor
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { lazy, Suspense } from 'react'
import { Card } from 'antd'
import { UniversalEditorProps } from './index'

export * from './shared'
export type { UniversalEditorProps } from './index'

const EditorComponent = lazy(() => {
  return import('./index').then((result) => {
    return { default: result.UniversalEditor }
  })
})

export const UniversalEditor: React.FC<UniversalEditorProps> = (props) => {
  return (
    <Suspense fallback={<Card size="small" loading />}>
      <EditorComponent {...props} />
    </Suspense>
  )
}
