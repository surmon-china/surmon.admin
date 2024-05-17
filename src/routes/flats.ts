import type { RouteObject } from '.'
import { routes } from './routes'
import { RoutesKey } from './keys'

export const flatRoutes: RouteObject[] = []
export const RoutesPath: Record<RoutesKey, string> = {} as any
export const RoutesMap = new Map<RoutesKey, RouteObject>()

const flatten = (list: RouteObject[]) => {
  list.forEach((route) => {
    if (route.id) {
      flatRoutes.push(route)
      RoutesPath[route.id as RoutesKey] = route.path!
      RoutesMap.set(route.id as RoutesKey, route)
    }
    if (route.children?.length) {
      flatten(route.children)
    }
  })
}

flatten(routes)
