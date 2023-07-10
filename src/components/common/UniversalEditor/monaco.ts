// https://github.com/suren-atoyan/monaco-react/tree/master#use-monaco-editor-as-an-npm-package

import { loader } from '@monaco-editor/react'

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

export * from 'monaco-editor'

self.MonacoEnvironment = {
  getWorker(_, label) {
    // 300+ kb
    if (label === 'json') {
      return new jsonWorker()
    }
    // 970+ kb
    // if (label === 'css' || label === 'scss' || label === 'less') {
    //   return new cssWorker()
    // }
    // 630+ kb
    // if (label === 'html' || label === 'handlebars' || label === 'razor') {
    //   return new htmlWorker()
    // }
    // 4,800+ kb
    // if (label === 'typescript' || label === 'javascript') {
    //   return new tsWorker()
    // }
    return new editorWorker()
  }
}

loader.config({ monaco })
loader.init().then(() => {
  console.log('monaco-editor is available.')
})
