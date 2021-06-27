/**
 * @file Article
 * @module constants.article
 * @author Surmon <https://github.com/surmon-china>
 */

import { DataExtends } from './general-state';
import { PublishState } from './publish-state';
import { Tag } from './tag';
import { Category } from './category';

/** 文章来源 */
export enum ArticleOrigin {
  Original = 0, // 原创
  Reprint = 1, // 转载
  Hybrid = 2, // 混合
}

/** 文章公开状态 */
export enum ArticlePublic {
  Password = 0, // 需要密码
  Public = 1, // 公开状态
  Secret = -1, // 私密
}

export type ArticleId = string | number;

/** 文章 */
export interface Article {
  id?: number;
  _id?: ArticleId;
  title: string;
  description: string;
  content?: string;
  keywords: string[];
  meta?: {
    likes: number;
    views: number;
    comments: number;
  };
  origin: ArticleOrigin;
  public: ArticlePublic;
  state: PublishState;
  update_at?: string;
  create_at?: string;
  tag: Array<Tag>;
  category: Array<Category>;
  password?: string;
  thumb?: string;
  extends: Array<DataExtends>;
}
