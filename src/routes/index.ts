/**
 * @file App routes
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { RouteObject as ReactRouteObject } from 'react-router-dom'

export { routes } from './routes'
export { pageRoutes } from './pages'

export { RoutesKey } from './keys'
export { RoutesPath, RoutesMap, flatRoutes } from './flats'

export const RoutesPather = {
  articleDetail: (articleID: string) => `/article/edit/${articleID}`
}

export interface RouteHandle {
  name?: string
  i18nKey?: string
  icon?: React.ReactElement
  hiddenInMenu?: boolean
}

export interface RouteObject extends Omit<ReactRouteObject, 'children'> {
  handle?: RouteHandle
  children?: RouteObject[]
}
