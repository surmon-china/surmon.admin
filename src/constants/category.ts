/**
 * @file Category
 * @module constants.category
 * @author Surmon <https://github.com/surmon-china>
 */

import { DataExtends } from './general-state';

/** 分类 */
export interface Category {
  id?: number;
  _id?: string;
  pid?: string;
  name: string;
  slug: string;
  count?: number;
  description: string;
  update_at: string;
  create_at: string;
  children?: Array<Category>;
  extends: Array<DataExtends>;
}
