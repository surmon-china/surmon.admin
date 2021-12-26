/**
 * @file Tag store
 * @author Surmon <https://github.com/surmon-china>
 */

import nodepress from '@/services/nodepress'
import { Tag } from '@/constants/tag'
import { ResponsePaginationData, GeneralGetPageParams } from '@/constants/request'

export const TAG_API_PATH = '/tag'

/** 获取标签参数 */
export interface GetTagParams extends GeneralGetPageParams {
  /** 搜索关键词 */
  keyword?: string
}

/** 获取标签列表 */
export function getTags(params: GetTagParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Tag>>(TAG_API_PATH, {
      params,
    })
    .then((response) => response.result)
}

/** 创建标签 */
export function createTag(tag: Tag) {
  return nodepress.post(TAG_API_PATH, tag).then((response) => response.result)
}

/** 修改标签 */
export function putTag(tag: Tag) {
  return nodepress
    .put(`${TAG_API_PATH}/${tag._id}`, tag)
    .then((response) => response.result)
}

/** 删除标签 */
export function deleteTag(tagId: string) {
  return nodepress
    .delete(`${TAG_API_PATH}/${tagId}`)
    .then((response) => response.result)
}

/** 批量删除标签 */
export function deleteTags(tagIds: string[]) {
  return nodepress
    .delete(TAG_API_PATH, { data: { tag_ids: tagIds } })
    .then((response) => response.result)
}
