/**
 * @file App component
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { onMounted, useReactivity } from 'veact'
import LoadingBar from 'react-top-loading-bar'
import 'moment/locale/zh-cn'

import { ENV, VITE_ENV, APP_COLOR_PRIMARY } from '@/config'
import { RouteKey, routeMap, rc } from '@/route'
import { loading } from '@/state/loading'
import { AppAuth } from '@/components/AppAuth'
import { AppLayout } from '@/components/AppLayout'

import { HelloPage } from '@/pages/Hello'
import { NotFoundPage } from './pages/NotFound'
import { DashboardPage } from './pages/Dashboard'
import { AnnouncementPage } from './pages/Announcement'
import { CategoryPage } from './pages/Category'
import { TagPage } from './pages/Tag'
import { CommentPage } from './pages/Comment'
import { ArticleList } from './pages/Article/List'
import { ArticleEdit } from './pages/Article/Edit'
import { ArticleCreate } from './pages/Article/Create'
import { ProfilePage } from './pages/Profile'

export const App: React.FC = () => {
  const loadingState = useReactivity(() => loading.state)

  onMounted(() => {
    console.info(`Run! env: ${ENV}, vite env: ${JSON.stringify(VITE_ENV)}`)
  })

  return (
    <div className="app" id="app">
      <LoadingBar
        shadow={false}
        height={3}
        waitingTime={200}
        loaderSpeed={600}
        className={loadingState.failed ? 'red' : APP_COLOR_PRIMARY}
        color={loadingState.failed ? 'red' : APP_COLOR_PRIMARY}
        progress={loadingState.percent}
      />
      {/* basename: WORKAROUND for outside */}
      <BrowserRouter basename={(window as any).basePath}>
        <Switch>
          <Route path="/" exact>
            <Redirect to={rc(RouteKey.Dashboard).path} />
          </Route>
          <Route
            path={Array.from(routeMap.values())
              .filter((route) => route.id !== RouteKey.Hello)
              .map((route) => route.path)}
          >
            <AppAuth>
              <AppLayout>
                <Switch>
                  <Route path={rc(RouteKey.Dashboard).path} exact>
                    <DashboardPage />
                  </Route>
                  <Route path={rc(RouteKey.Announcement).path} exact>
                    <AnnouncementPage />
                  </Route>
                  <Route path={rc(RouteKey.Category).path} exact>
                    <CategoryPage />
                  </Route>
                  <Route path={rc(RouteKey.Tag).path} exact>
                    <TagPage />
                  </Route>
                  <Route path={rc(RouteKey.Comment).path} exact>
                    <CommentPage />
                  </Route>
                  <Route path={rc(RouteKey.Article).path}>
                    <Switch>
                      <Route path={rc(RouteKey.ArticlePost).path} exact>
                        <ArticleCreate />
                      </Route>
                      <Route path={rc(RouteKey.ArticleEdit).path} exact>
                        <ArticleEdit />
                      </Route>
                      <Route path={rc(RouteKey.ArticleList).path} exact>
                        <ArticleList />
                      </Route>
                      <Redirect to={rc(RouteKey.ArticleList).path} />
                    </Switch>
                  </Route>
                  <Route path={rc(RouteKey.Profile).path} exact>
                    <ProfilePage />
                  </Route>
                </Switch>
              </AppLayout>
            </AppAuth>
          </Route>
          <Route path={rc(RouteKey.Hello).path} exact>
            <HelloPage />
          </Route>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}
