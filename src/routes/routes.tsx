import React from 'react'
import { Outlet } from 'react-router'

import { AppAuth } from '@/components/AppAuth'
import { AppLayout } from '@/components/AppLayout'
import { HelloPage } from '@/pages/Hello'
import { NotFoundPage } from '@/pages/NotFound'

import { pageRoutes } from './pages'
import { RoutesKey } from './keys'
import { RouteObject } from '.'

export const routes: RouteObject[] = [
  {
    id: RoutesKey.Hello,
    path: '/hello',
    element: <HelloPage />
  },
  {
    path: '/',
    children: pageRoutes,
    element: (
      <AppAuth>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </AppAuth>
    )
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]
