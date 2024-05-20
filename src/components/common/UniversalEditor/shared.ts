import { debounce } from 'lodash'
import storage from '@/services/storage'

export enum UnEditorLanguage {
  Markdown = 'markdown',
  JSON = 'json',
  YAML = 'yaml'
}

export const UnEditorLanguages = [
  {
    id: UnEditorLanguage.Markdown,
    name: 'Markdown',
    ext: 'md'
  },
  {
    id: UnEditorLanguage.JSON,
    name: 'JSON',
    ext: 'json'
  },
  {
    id: UnEditorLanguage.YAML,
    name: 'YAML',
    ext: 'yaml'
  }
]

export const UnEditorLanguageMap: ReadonlyMap<UnEditorLanguage, (typeof UnEditorLanguages)[0]> =
  new Map(UnEditorLanguages.map((item) => [item.id, item]))

const getEditorCacheStorageKey = (id: string) => {
  return `uneditor-${id}`
}

export const setUnEditorCache = debounce((id: string, content: string) => {
  return storage.set(getEditorCacheStorageKey(id), content)
}, 666)

export const getUnEditorCache = (id: string) => {
  return storage.get(getEditorCacheStorageKey(id))
}
