import React from 'react'
import { onMounted, useShallowRef } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Input, Select, Space, Flex, TreeSelect } from 'antd'
import * as Icons from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { SortSelect } from '@/components/common/SortSelect'
import { SortTypeWithHot } from '@/constants/sort'
import type { CategoryTree } from '@/apis/category'
import type { Tag } from '@/constants/tag'
import type { GetArticleParams } from '@/apis/article'
import { getAllTags } from '@/apis/tag'
import { getAllCategories, getAntdTreeByTree } from '@/apis/category'
import { ArticlePublish, articlePublishs } from '@/constants/article'
import { ArticlePublic, articlePublics } from '@/constants/article'
import { ArticleOrigin, articleOrigins } from '@/constants/article'
import { ArticleLanguage, articleLanguages } from '@/constants/article'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = {
  sort: SortTypeWithHot.Desc,
  featured: false as boolean,
  tag_slug: SELECT_ALL_VALUE as SelectAllValue | string,
  category_slug: SELECT_ALL_VALUE as SelectAllValue | string,
  public: SELECT_ALL_VALUE as SelectAllValue | ArticlePublic,
  state: SELECT_ALL_VALUE as SelectAllValue | ArticlePublish,
  origin: SELECT_ALL_VALUE as SelectAllValue | ArticleOrigin,
  lang: SELECT_ALL_VALUE as SelectAllValue | ArticleLanguage
}

export type SelectAllValue = typeof SELECT_ALL_VALUE
export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams): GetArticleParams => ({
  sort: params.sort,
  featured: params.featured ? true : void 0,
  tag_slug: params.tag_slug !== SELECT_ALL_VALUE ? params.tag_slug : void 0,
  category_slug: params.category_slug !== SELECT_ALL_VALUE ? params.category_slug : void 0,
  state: params.state !== SELECT_ALL_VALUE ? params.state : void 0,
  public: params.public !== SELECT_ALL_VALUE ? params.public : void 0,
  origin: params.origin !== SELECT_ALL_VALUE ? params.origin : void 0,
  lang: params.lang !== SELECT_ALL_VALUE ? params.lang : void 0
})

export interface ListFiltersProps {
  loading: boolean
  params: FilterParams
  onParamsChange(value: Partial<FilterParams>): void
  keyword: string
  onKeywordChange(keyword: string): void
  onKeywordSearch(): void
  onResetRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  const { i18n } = useTranslation()

  // categories
  const categoryFetching = useLoading()
  const categoriesTree = useShallowRef<CategoryTree[]>([])
  const fetchCategories = () => {
    categoryFetching.promise(getAllCategories()).then((result) => {
      categoriesTree.value = result.tree
    })
  }

  // tags
  const tagFetching = useLoading()
  const tags = useShallowRef<Tag[]>([])
  const fetchTags = () => {
    tagFetching.promise(getAllTags()).then((result) => {
      tags.value = result
    })
  }

  onMounted(() => {
    fetchTags()
    fetchCategories()
  })

  return (
    <Flex justify="space-between" align="start" gap="middle" wrap>
      <Space direction="vertical">
        <Space wrap>
          <Button
            disabled={props.loading}
            type={props.params.featured ? 'primary' : 'default'}
            icon={props.params.featured ? <Icons.StarFilled /> : <Icons.StarOutlined />}
            onClick={() => props.onParamsChange({ featured: !props.params.featured })}
          >
            {i18n.t('page.article.list.filter.featured')}
          </Button>
          <Select
            style={{ width: 110 }}
            disabled={props.loading}
            value={props.params.state}
            onChange={(state) => props.onParamsChange({ state })}
            options={[
              { label: '全部状态', value: SELECT_ALL_VALUE },
              ...articlePublishs.map((state) => ({
                value: state.id,
                label: (
                  <Space size="small">
                    {state.icon}
                    {state.name}
                  </Space>
                )
              }))
            ]}
          />
          <Select
            style={{ width: 106 }}
            disabled={props.loading}
            value={props.params.public}
            onChange={(value) => props.onParamsChange({ public: value })}
            options={[
              { label: '全部可见', value: SELECT_ALL_VALUE },
              ...articlePublics.map((item) => ({
                value: item.id,
                label: (
                  <Space size="small">
                    {item.icon}
                    {item.name}
                  </Space>
                )
              }))
            ]}
          />
          <Select
            style={{ width: 106 }}
            disabled={props.loading}
            value={props.params.origin}
            onChange={(origin) => props.onParamsChange({ origin })}
            options={[
              { label: '全部来源', value: SELECT_ALL_VALUE },
              ...articleOrigins.map((origin) => ({
                value: origin.id,
                label: (
                  <Space size="small">
                    {origin.icon}
                    {origin.name}
                  </Space>
                )
              }))
            ]}
          />
          <Select
            style={{ width: 114 }}
            disabled={props.loading}
            value={props.params.lang}
            onChange={(lang) => props.onParamsChange({ lang })}
            options={[
              { label: '全部语言', value: SELECT_ALL_VALUE },
              ...articleLanguages.map((lang) => ({
                value: lang.id,
                label: (
                  <Space size="small">
                    {lang.icon}
                    {lang.name}
                  </Space>
                )
              }))
            ]}
          />
          <Space.Compact>
            <TreeSelect
              style={{ width: 150 }}
              loading={categoryFetching.state.value}
              placeholder="选择父分类"
              treeDefaultExpandAll={true}
              disabled={props.loading}
              value={props.params.category_slug}
              onChange={(category_slug) => props.onParamsChange({ category_slug })}
              treeData={[
                {
                  label: '全部分类',
                  key: SELECT_ALL_VALUE,
                  value: SELECT_ALL_VALUE
                },
                ...getAntdTreeByTree({
                  tree: categoriesTree.value,
                  valuer: (category) => category.slug
                })
              ]}
            />
            <Select
              style={{ width: 140 }}
              loading={tagFetching.state.value}
              disabled={props.loading}
              value={props.params.tag_slug}
              onChange={(tag_slug) => props.onParamsChange({ tag_slug })}
              options={[
                { label: '全部标签', value: SELECT_ALL_VALUE },
                ...tags.value.map((tag) => ({
                  value: tag.slug,
                  label: `${tag.name} (${tag.article_count})`
                }))
              ]}
            />
          </Space.Compact>
        </Space>
        <Space wrap>
          <SortSelect
            style={{ width: 110 }}
            disabled={props.loading}
            withHot={true}
            value={props.params.sort}
            onChange={(sort) => props.onParamsChange({ sort })}
          />
          <Input.Search
            style={{ width: 260 }}
            placeholder={i18n.t('page.article.list.filter.search')}
            disabled={props.loading}
            value={props.keyword}
            onChange={(event) => props.onKeywordChange(event.target.value)}
            allowClear={true}
            onSearch={(_, __, info) => {
              if (info?.source === 'input') {
                props.onKeywordSearch()
              }
            }}
          />
          <Button
            icon={<Icons.ReloadOutlined />}
            loading={props.loading}
            onClick={props.onResetRefresh}
          >
            {i18n.t('common.list.filter.refresh_with_reset')}
          </Button>
        </Space>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
