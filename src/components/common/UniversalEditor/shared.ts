import { debounce } from 'lodash'
import storage from '@/services/storage'

export enum UEditorLanguage {
  Markdown = 'markdown',
  JSON = 'json',
  YAML = 'yaml'
}

export const UEditorLanguages = [
  {
    id: UEditorLanguage.Markdown,
    name: 'Markdown',
    ext: 'md'
  },
  {
    id: UEditorLanguage.JSON,
    name: 'JSON',
    ext: 'json'
  },
  {
    id: UEditorLanguage.YAML,
    name: 'YAML',
    ext: 'yaml'
  }
]

export const UEditorLanguageMap: ReadonlyMap<UEditorLanguage, (typeof UEditorLanguages)[0]> =
  new Map(UEditorLanguages.map((item) => [item.id, item]))

const getEditorCacheStorageKey = (id: string) => {
  return `ueditor-${id}`
}

export const setUEditorCache = debounce((id: string, content: string) => {
  return storage.set(getEditorCacheStorageKey(id), content)
}, 666)

export const getUEditorCache = (id: string) => {
  return storage.get(getEditorCacheStorageKey(id))
}
