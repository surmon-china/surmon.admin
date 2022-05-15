import { debounce } from 'lodash'
import storage from '@/services/storage'

export enum UEditorLanguage {
  Markdown = 'markdown',
  JSON = 'json',
}

const getEditorCacheStorageKey = (id: string) => {
  return `ueditor-${id}`
}

export const setUEditorCache = debounce((id: string, content: string) => {
  return storage.set(getEditorCacheStorageKey(id), content)
}, 666)

export const getUEditorCache = (id: string) => {
  return storage.get(getEditorCacheStorageKey(id))
}
