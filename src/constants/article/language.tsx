/**
 * @file Article language
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icon from '@ant-design/icons'

// 文章语言: https://github.com/surmon-china/nodepress/blob/main/src/constants/biz.constant.ts#L8
// language: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export enum ArticleLanguage {
  English = 'en', // English
  Chinese = 'zh' // 简体中文
}

const articleLanguageMap = new Map(
  [
    {
      id: ArticleLanguage.Chinese,
      name: '中文',
      icon: <Icon.GlobalOutlined />,
      color: '#ee1c25'
    },
    {
      id: ArticleLanguage.English,
      name: 'English',
      icon: <Icon.GlobalOutlined />,
      color: '#002164'
    }
  ].map((item) => [item.id, item])
)

export const al = (language: ArticleLanguage) => {
  return articleLanguageMap.get(language)!
}
export const articleLanguages = Array.from<ReturnType<typeof al>>(articleLanguageMap.values())
