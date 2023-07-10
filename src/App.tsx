/**
 * @file App component
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { BrowserRouter, HashRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { onMounted } from 'veact'
import LoadingBar from 'react-top-loading-bar'

import { ENV, VITE_ENV, APP_COLOR_PRIMARY, ENABLEd_HASH_ROUTER } from '@/config'
import { RouteKey, rc } from '@/routes'
import { useLoadingState } from '@/state/loading'
import { AppAuth } from '@/components/AppAuth'
import { AppLayout } from '@/components/AppLayout'

import { HelloPage } from '@/pages/Hello'
import { NotFoundPage } from '@/pages/NotFound'
import { DashboardPage } from '@/pages/Dashboard'
import { AnnouncementPage } from '@/pages/Announcement'
import { CategoryPage } from '@/pages/Category'
import { TagPage } from '@/pages/Tag'
import { CommentPage } from '@/pages/Comment'
import { VotePage } from '@/pages/Vote'
import { FeedbackPage } from '@/pages/Feedback'
import { DisqusThreadsPage } from '@/pages/Dsiqus/Thread'
import { DisqusPostsPage } from '@/pages/Dsiqus/Post'
import { DisqusSynchronizePage } from '@/pages/Dsiqus/Synchronize'
import { ArticleList } from '@/pages/Article/List'
import { ArticleEdit } from '@/pages/Article/Edit'
import { ArticleCreate } from '@/pages/Article/Create'
import { ProfilePage } from '@/pages/Profile'

// Router: WORKAROUND for outside
const RouterComponent: React.FC<React.PropsWithChildren> = (props) => {
  return ENABLEd_HASH_ROUTER ? (
    <HashRouter>{props.children}</HashRouter>
  ) : (
    <BrowserRouter>{props.children}</BrowserRouter>
  )
}

export const App: React.FC = () => {
  const loadingState = useLoadingState()

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
        className={loadingState.state.failed ? 'red' : APP_COLOR_PRIMARY}
        color={loadingState.state.failed ? 'red' : APP_COLOR_PRIMARY}
        progress={loadingState.state.percent}
      />
      <RouterComponent>
        <Routes>
          <Route path={rc(RouteKey.Hello).path} element={<HelloPage />} />
          <Route
            path="/"
            element={
              <AppAuth>
                <AppLayout>
                  <Outlet />
                </AppLayout>
              </AppAuth>
            }
          >
            <Route index={true} element={<Navigate to={rc(RouteKey.Dashboard).path} replace />} />
            <Route path={rc(RouteKey.Dashboard).path} element={<DashboardPage />} />
            <Route path={rc(RouteKey.Announcement).path} element={<AnnouncementPage />} />
            <Route path={rc(RouteKey.Category).path} element={<CategoryPage />} />
            <Route path={rc(RouteKey.Tag).path} element={<TagPage />} />
            <Route path={rc(RouteKey.Comment).path} element={<CommentPage />} />
            <Route path={rc(RouteKey.Vote).path} element={<VotePage />} />
            <Route path={rc(RouteKey.Feedback).path} element={<FeedbackPage />} />
            <Route path={rc(RouteKey.Profile).path} element={<ProfilePage />} />
            <Route
              path={`${rc(RouteKey.Disqus).path}/*`}
              element={
                <Routes>
                  <Route
                    index={true}
                    element={<Navigate to={rc(RouteKey.DisqusPost).subPath!} replace />}
                  />
                  <Route path={rc(RouteKey.DisqusPost).subPath} element={<DisqusPostsPage />} />
                  <Route
                    path={rc(RouteKey.DisqusThread).subPath}
                    element={<DisqusThreadsPage />}
                  />
                  <Route
                    path={rc(RouteKey.DisqusSync).subPath}
                    element={<DisqusSynchronizePage />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to={rc(RouteKey.DisqusPost).path} replace />}
                  />
                </Routes>
              }
            />
            <Route
              path={`${rc(RouteKey.Article).path}/*`}
              element={
                <Routes>
                  <Route
                    index={true}
                    element={<Navigate to={rc(RouteKey.ArticleList).subPath!} replace />}
                  />
                  <Route path={rc(RouteKey.ArticleList).subPath} element={<ArticleList />} />
                  <Route path={rc(RouteKey.ArticlePost).subPath} element={<ArticleCreate />} />
                  <Route path={rc(RouteKey.ArticleEdit).subPath} element={<ArticleEdit />} />
                  <Route
                    path="*"
                    element={<Navigate to={rc(RouteKey.ArticleList).path} replace />}
                  />
                </Routes>
              }
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </RouterComponent>
    </div>
  )
}
