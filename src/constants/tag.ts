/**
 * @file Tag
 * @module constants.tag
 * @author Surmon <https://github.com/surmon-china>
 */

import { DataExtends } from './general-state';

/** 标签数据 */
export interface Tag {
  id?: number;
  _id?: string;
  name: string;
  slug: string;
  count?: number;
  description: string;
  update_at: string;
  create_at: string;
  extends: Array<DataExtends>;
}
