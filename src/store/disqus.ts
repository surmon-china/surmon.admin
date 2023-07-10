/**
 * @file Disqus store
 * @author Surmon <https://github.com/surmon-china>
 */

import { saveFile } from '@/services/file'
import nodepress from '@/services/nodepress'

export const DISQUS_API_PATH = '/disqus'

export enum OrderType {
  Desc = 'desc',
  Asc = 'asc'
}

export enum ThreadState {
  Open = 'open',
  Closed = 'closed'
}

export enum PostState {
  Unapproved = 'unapproved',
  Approved = 'approved',
  Spam = 'spam',
  Deleted = 'deleted',
  Flagged = 'flagged',
  Highlighted = 'highlighted'
}

export interface GeneralDisqusParams {
  [key: string]: any
}

export function getThreads(params: GeneralDisqusParams) {
  return nodepress.get<any>(`${DISQUS_API_PATH}/threads`, { params })
}

export function getPosts(params: GeneralDisqusParams) {
  return nodepress.get<any>(`${DISQUS_API_PATH}/posts`, { params })
}

export function getConfig() {
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
