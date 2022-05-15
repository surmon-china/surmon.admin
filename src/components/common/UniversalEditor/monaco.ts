import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

// all languages
import 'monaco-editor/esm/vs/basic-languages/monaco.contribution'

export * from 'monaco-editor'

// eslint-disable-next-line no-restricted-globals
;(self as any).MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    return new editorWorker()
  },
}
