/**
 * @desc General universal editor
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Card } from 'antd'
import { ThemeProvider, Theme } from '@/contexts/Theme'
import { LocaleProvider, Language } from '@/contexts/Locale'
import type { UniversalEditorProps } from './Editor'

export { UnEditorLanguage, UnEditorLanguages, getUnEditorCache } from './shared'
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

export interface UnEditorWithProvidersOptions {
  initTheme: Theme
  initLanguage: Language
}

export const getUnEditorWithProviders = (options: UnEditorWithProvidersOptions) => {
  return (props: UniversalEditorProps) => (
    <ThemeProvider initTheme={options.initTheme}>
      <LocaleProvider initLanguage={options.initLanguage}>
        <UniversalEditor {...props} />
      </LocaleProvider>
    </ThemeProvider>
  )
}
