/**
 * @desc Lazy universal editor
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Card } from 'antd'
import { loader } from '@monaco-editor/react'
import { UniversalEditor as Editor, UniversalEditorProps } from '../UniversalEditor/Editor'

export * from './shared'
export type { UniversalEditorProps } from './Editor'

// Import the monaco-editor library asynchronously using the import statement to spoof React as an asynchronous component,
// but it complicates the API.
const EditorComponent = React.lazy(() => {
  return Promise.all([
    import('monaco-editor/esm/vs/editor/editor.worker?worker'),
    import('monaco-editor/esm/vs/language/json/json.worker?worker'),
    import('monaco-editor')
  ]).then(([{ default: editorWorker }, { default: jsonWorker }, monaco]) => {
    // init monaco environment
    self.MonacoEnvironment = {
      getWorker(_, label) {
        return label === 'json' ? new jsonWorker() : new editorWorker()
      }
    }
    // init monaco loader
    loader.config({ monaco })
    loader.init().then(() => {
      console.log('monaco-editor is available.')
    })
    // return wrapper component
    return {
      // @ts-ignore
      default: (props: UniversalEditorProps) => <Editor {...props} monaco={monaco} />
    }
  })
})

export const UniversalEditor: React.FC<UniversalEditorProps> = (props) => {
  return (
    <React.Suspense fallback={<Card size="small" loading />}>
      <EditorComponent {...props} />
    </React.Suspense>
  )
}
