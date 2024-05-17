/**
 * @file Article list page
 * @author Surmon <https://github.com/surmon-china>
 */

import _ from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import {
  useShallowReactive,
  useRef,
  toRaw,
  onMounted,
  batchedUpdates,
  useReactive,
  useWatch
} from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Input, Select, Divider, Modal, Space, TreeSelect } from 'antd'
import * as Icon from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { RoutesKey, RoutesPath } from '@/routes'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { SortSelect } from '@/components/common/SortSelect'
import { ResponsePaginationData } from '@/constants/nodepress'
import { SortTypeWithHot } from '@/constants/sort'
import { publishStates, PublishState, getPublishState } from '@/constants/publish'
import { Tag } from '@/constants/tag'
import {
  ArticleId,
  Article,
  ArticleOrigin,
  articleOrigins,
  ArticlePublic,
  articlePublics,
  ArticleLanguage,
  articleLanguages
} from '@/constants/article'
import { scrollTo } from '@/services/scroller'
import { getTags } from '@/apis/tag'
import { getArticles, GetArticleParams, patchArticlesState } from '@/apis/article'
import { getCategories, getAntdTreeByTree, CategoryTree } from '@/apis/category'
import { ArticleListTable } from './Table'

import styles from './style.module.less'

type SelectAllType = typeof SELECT_ALL_VALUE
const SELECT_ALL_VALUE = 'ALL'
const DEFAULT_FILTER_PARAMS = Object.freeze({
  sort: SortTypeWithHot.Desc,
  tag_slug: SELECT_ALL_VALUE as SelectAllType | string,
  category_slug: SELECT_ALL_VALUE as SelectAllType | string,
  featured: SELECT_ALL_VALUE as SelectAllType | boolean,
  lang: SELECT_ALL_VALUE as SelectAllType | ArticleLanguage,
  public: SELECT_ALL_VALUE as SelectAllType | ArticlePublic,
  origin: SELECT_ALL_VALUE as SelectAllType | ArticleOrigin,
  state: SELECT_ALL_VALUE as SelectAllType | PublishState
})

export const ArticleList: React.FC = () => {
  const { i18n } = useTranslation()
  const loading = useLoading()
  const article = useShallowReactive<ResponsePaginationData<Article>>({
    data: [],
    pagination: undefined
  })

  // 分类
  const loadingCategory = useLoading()
  const categoriesTree = useRef<Array<CategoryTree>>([])
  const fetchCategories = () => {
    loadingCategory.promise(getCategories({ per_page: 50 })).then((result) => {
      categoriesTree.value = result.tree
    })
  }

  // 标签
  const loadingTag = useLoading()
  const tags = useRef<Array<Tag>>([])
  const fetchTags = () => {
    loadingTag.promise(getTags({ per_page: 50 })).then((result) => {
      tags.value = result.data
    })
  }

  // 过滤参数
  const serarchKeyword = useRef('')
  const filterParams = useReactive({ ...DEFAULT_FILTER_PARAMS })

  // 多选
  const selectedIds = useRef<Array<string>>([])
  const handleSelect = (ids: any[]) => {
    selectedIds.value = ids
  }

  const fetchData = (params?: GetArticleParams) => {
    const getParams: any = {
      ...params,
      ...filterParams,
      keyword: Boolean(serarchKeyword.value) ? serarchKeyword.value : undefined
    }
    Object.keys(getParams).forEach((paramKey) => {
      if (getParams[paramKey] === SELECT_ALL_VALUE) {
        Reflect.deleteProperty(getParams, paramKey)
      }
    })

    loading.promise(getArticles(getParams)).then((result) => {
      batchedUpdates(() => {
        article.data = result.data
        article.pagination = result.pagination
      })
      scrollTo(document.body)
    })
  }

  const resetParamsAndRefresh = () => {
    serarchKeyword.value = ''
    if (_.isEqual(toRaw(filterParams), DEFAULT_FILTER_PARAMS)) {
      fetchData()
    } else {
      batchedUpdates(() => {
        Object.keys(DEFAULT_FILTER_PARAMS).forEach((paramKey) => {
          // @ts-ignore
          filterParams[paramKey] = Reflect.get(DEFAULT_FILTER_PARAMS, paramKey)
        })
      })
    }
  }

  const refreshData = () => {
    fetchData({
      page: article.pagination?.current_page,
      per_page: article.pagination?.per_page
    })
  }

  const handleStateChange = (articleIds: Array<ArticleId>, state: PublishState) => {
    Modal.confirm({
      title: `确定要将 ${articleIds.length} 个文章更新为「 ${getPublishState(state).name} 」状态吗？`,
      content: '操作不可撤销',
      centered: true,
      onOk() {
        return patchArticlesState(articleIds, state).then(() => {
          refreshData()
        })
      }
    })
  }

  useWatch(filterParams, () => fetchData())

  onMounted(() => {
    fetchData()
    fetchCategories()
    fetchTags()
  })

  return (
    <Card
      bordered={false}
      className={styles.articleList}
      title={i18n.t('page.article.list.title', { total: article.pagination?.total ?? '-' })}
      extra={
        <Link to={RoutesPath[RoutesKey.ArticlePost]}>
          <Button type="primary" size="small" icon={<Icon.EditOutlined />}>
            {i18n.t('page.article.create')}
          </Button>
        </Link>
      }
    >
      <Space className={styles.toolbar} align="center" wrap>
        <Space direction="vertical">
          <Space wrap>
            <Button
              type={filterParams.featured === true ? 'primary' : 'default'}
              icon={filterParams.featured === true ? <Icon.StarFilled /> : <Icon.StarOutlined />}
              onClick={() => {
                filterParams.featured = filterParams.featured === true ? SELECT_ALL_VALUE : true
              }}
            >
              {i18n.t('page.article.list.filter.featured')}
            </Button>
            <Select
              className={styles.select}
              loading={loading.state.value}
              value={filterParams.state}
              onChange={(state) => {
                filterParams.state = state
              }}
              options={[
                { label: '全部状态', value: SELECT_ALL_VALUE },
                ...publishStates.map((state) => {
                  return {
                    value: state.id,
                    label: (
                      <Space>
                        {state.icon}
                        {state.name}
                      </Space>
                    )
                  }
                })
              ]}
            />
            <Select
              className={styles.select}
              loading={loading.state.value}
              value={filterParams.public}
              onChange={(state) => {
                filterParams.public = state
              }}
              options={[
                { label: '全部可见', value: SELECT_ALL_VALUE },
                ...articlePublics.map((state) => {
                  return {
                    value: state.id,
                    label: (
                      <Space>
                        {state.icon}
                        {state.name}
                      </Space>
                    )
                  }
                })
              ]}
            />
            <Select
              className={styles.select}
              loading={loading.state.value}
              value={filterParams.origin}
              onChange={(state) => {
                filterParams.origin = state
              }}
              options={[
                { label: '全部来源', value: SELECT_ALL_VALUE },
                ...articleOrigins.map((state) => {
                  return {
                    value: state.id,
                    label: (
                      <Space>
                        {state.icon}
                        {state.name}
                      </Space>
                    )
                  }
                })
              ]}
            />
            <Select
              className={styles.select}
              loading={loading.state.value}
              value={filterParams.lang}
              onChange={(state) => {
                filterParams.lang = state
              }}
              options={[
                { label: '全部语言', value: SELECT_ALL_VALUE },
                ...articleLanguages.map((state) => {
                  return {
                    value: state.id,
                    label: (
                      <Space>
                        {state.icon}
                        {state.name}
                      </Space>
                    )
                  }
                })
              ]}
            />
            <SortSelect
              className={styles.select}
              loading={loading.state.value}
              withHot={true}
              value={filterParams.sort}
              onChange={(sort) => {
                filterParams.sort = sort
              }}
            />
            <Select
              className={styles.tagSelect}
              loading={loadingTag.state.value}
              value={filterParams.tag_slug}
              onChange={(slug) => {
                filterParams.tag_slug = slug
              }}
              options={[
                { label: '全部标签', value: SELECT_ALL_VALUE },
                ...tags.value.map((tag) => ({
                  value: tag.slug,
                  label: `${tag.name} (${tag.article_count})`
                }))
              ]}
            />
            <TreeSelect
              placeholder="选择父分类"
              treeDefaultExpandAll={true}
              className={styles.categoriesSelect}
              loading={loadingCategory.state.value}
              value={filterParams.category_slug}
              onChange={(slug) => {
                filterParams.category_slug = slug
              }}
              treeData={[
                {
                  label: '全部分类',
                  key: SELECT_ALL_VALUE,
                  value: SELECT_ALL_VALUE
                },
                ...getAntdTreeByTree({
                  tree: categoriesTree.value,
                  valuer: (c) => c.slug
                })
              ]}
            />
          </Space>
          <Space wrap>
            <Input.Search
              className={styles.search}
              placeholder={i18n.t('page.article.list.filter.search')}
              loading={loading.state.value}
              onSearch={() => fetchData()}
              value={serarchKeyword.value}
              onChange={(event) => {
                serarchKeyword.value = event.target.value
              }}
            />
            <Button
              icon={<Icon.ReloadOutlined />}
              loading={loading.state.value}
              onClick={resetParamsAndRefresh}
            >
              {i18n.t('common.list.filter.reset_and_refresh')}
            </Button>
          </Space>
        </Space>
        <Space>
          <DropdownMenu
            text="批量操作"
            disabled={!selectedIds.value.length}
            options={[
              {
                label: '退为草稿',
                icon: <Icon.RollbackOutlined />,
                onClick: () => handleStateChange(selectedIds.value, PublishState.Draft)
              },
              {
                label: '直接发布',
                icon: <Icon.CheckOutlined />,
                onClick: () => handleStateChange(selectedIds.value, PublishState.Published)
              },
              {
                label: '移回收站',
                icon: <Icon.DeleteOutlined />,
                onClick: () => handleStateChange(selectedIds.value, PublishState.Recycle)
              }
            ]}
          />
        </Space>
      </Space>
      <Divider />
      <ArticleListTable
        loading={loading.state.value}
        selectedIds={selectedIds.value}
        onSelecte={handleSelect}
        data={article.data}
        pagination={article.pagination!}
        onUpdateState={(article, state) => handleStateChange([article._id!], state)}
        onPagination={(page, pageSize) => fetchData({ page, per_page: pageSize })}
      />
    </Card>
  )
}
