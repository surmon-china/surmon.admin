/**
 * @file Disqus
 * @author Surmon <https://github.com/surmon-china>
 */

import { saveFile } from '@/utils/file'
import nodepress from '@/services/nodepress'

export const DISQUS_API_PATH = '/disqus'

export interface GeneralDisqusParams {
  [key: string]: any
}

export function getDisqusThreads(params: GeneralDisqusParams) {
  return nodepress.get<any>(`${DISQUS_API_PATH}/threads`, { params })
}

export function getDisqusPosts(params: GeneralDisqusParams) {
  return nodepress.get<any>(`${DISQUS_API_PATH}/posts`, { params })
}

export function getDisqusConfig() {
  return nodepress.get<any>(`${DISQUS_API_PATH}/config`)
}

export async function importDisqusXMLToNodePress(file: File) {
  const param = new FormData()
  param.append('file', file)
  return nodepress.post(`${DISQUS_API_PATH}/import-xml`, param)
}

export async function downloadNodePressXMLToDisqus() {
  const response = await nodepress.$({
    url: `${DISQUS_API_PATH}/export-xml`,
    method: 'GET',
    responseType: 'blob'
  })
  saveFile(response.data, 'nodepress-export-to-disqus.xml', 'application/xml')
}
