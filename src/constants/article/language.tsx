/**
 * @file Article language
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'

const EmojiIcon: React.FC<{ emoji: string }> = ({ emoji }) => {
  return <span style={{ transform: 'scale(1.3)', display: 'inline-block' }}>{emoji}</span>
}

// 文章语言: https://github.com/surmon-china/nodepress/blob/main/src/constants/biz.constant.ts#L8
// language: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export enum ArticleLanguage {
  English = 'en', // English
  Chinese = 'zh', // 简体中文
  Mixed = 'mix' // 多语言混合
}

export const articleLanguages = [
  {
    id: ArticleLanguage.Chinese,
    name: '中文',
    icon: <EmojiIcon emoji="🇨🇳" />
  },
  {
    id: ArticleLanguage.English,
    name: 'English',
    icon: <EmojiIcon emoji="🇺🇸" />
  },
  {
    id: ArticleLanguage.Mixed,
    name: '多语言',
    icon: <EmojiIcon emoji="🌐" />
  }
]

const articleLanguageMap = new Map(articleLanguages.map((item) => [item.id, item]))

export const getArticleLanguage = (language: ArticleLanguage) => {
  return articleLanguageMap.get(language)!
}
