/**
 * @file Static
 * @author Surmon <https://github.com/surmon-china>
 */

import _isNumber from 'lodash/isNumber'
import nodepress from '@/services/nodepress'

export const STATIC_API_PATHS = {
  UPLOAD: '/extension/static/upload',
  LIST: '/extension/static/list'
}

export interface StaticFileObject {
  key: string
  url: string
  eTag: string
  size: number
  lastModified?: number
  storageClass?: string
}

export type StaticFileListResult = Awaited<ReturnType<typeof getStaticFileList>>

/** 获取静态文件列表 */
export async function getStaticFileList(params?: {
  limit?: number
  prefix?: string
  startAfter?: string
  delimiter?: string
}) {
  return nodepress
    .get<{
      name?: string
      limit?: number
      prefix?: string
      marker?: string
      delimiter?: string
      startAfter?: string
      commonPrefixes?: Array<{ Prefix?: string }>
      files: StaticFileObject[]
    }>(STATIC_API_PATHS.LIST, { params })
    .then((response) => response.result)
}

/** 上传静态文件 */
export async function uploadStaticToNodePress(options: {
  file: File
  name: string
  onProgress?: (progress: number) => void
}) {
  const param = new FormData()
  param.append('file', options.file)
  param.append('name', options.name)
  return nodepress
    .post<StaticFileObject>(STATIC_API_PATHS.UPLOAD, param, {
      onUploadProgress: ({ loaded, total }) => {
        if (_isNumber(total)) {
          const progress = (loaded / total) * 100
          options.onProgress?.(progress)
        }
      }
    })
    .then((response) => response.result)
}
