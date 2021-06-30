/**
 * @file Category store
 * @author Surmon <https://github.com/surmon-china>
 */

import { arrayToTree } from 'performant-array-to-tree';
import { DataNode } from 'antd/lib/tree';

import http from '@/services/http';
import { Category } from '@/constants/category';
import { ResponsePaginationData, GeneralGetPageParams } from '@/constants/request';

export const CATEGORY_API_PATH = '/category';

export interface CategoryTree extends Category {
  children?: Array<CategoryTree>;
}

/** 获取分类列表 */
export function getCategories(params: GeneralGetPageParams = {}) {
  return http
    .get<ResponsePaginationData<Category>>(CATEGORY_API_PATH, {
      params,
    })
    .then((response) => ({
      ...response.result,
      tree: arrayToTree(response.result.data, {
        id: '_id',
        parentId: 'pid',
        childrenField: 'children',
        dataField: null,
      }) as Array<CategoryTree>,
    }));
}

/** 获取符合 Antd 的分类树 */
export function getAntdTreeByTree(
  tree: Array<CategoryTree>,
  currentCategoryId?: string
) {
  const toAntdTree = (_tree: Array<CategoryTree>): DataNode[] => {
    return _tree.map((category) => ({
      data: category,
      title: category.name,
      key: category._id!,
      disabled: Boolean(currentCategoryId && currentCategoryId === category._id),
      children: toAntdTree(category.children || []),
    }));
  };
  return toAntdTree(tree);
}

/** 创建分类 */
export function createCategory(category: Category) {
  return http.post(CATEGORY_API_PATH, category).then((response) => response.result);
}

/** 修改分类 */
export function putCategory(category: Category) {
  return http
    .put(`${CATEGORY_API_PATH}/${category._id}`, category)
    .then((response) => response.result);
}

/** 删除分类 */
export function deleteCategory(categoryId: string) {
  return http
    .delete(`${CATEGORY_API_PATH}/${categoryId}`)
    .then((response) => response.result);
}

/** 批量删除分类 */
export function deleteCategories(categoriesIds: string[]) {
  return http
    .delete(CATEGORY_API_PATH, { data: { categorie_ids: categoriesIds } })
    .then((response) => response.result);
}
