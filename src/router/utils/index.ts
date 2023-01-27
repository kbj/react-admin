//递归查询对应的路由
import type { AuthRouteObject } from '@/global/types/common'

/**
 * 递归查询对应路由对象信息
 * @param path    当前访问地址
 * @param routes  全局路由信息
 */
export const searchRouteDetail = (
  path: string,
  routes: AuthRouteObject[]
): AuthRouteObject | null => {
  for (let item of routes) {
    if (item.path === path) {
      return item
    }
    if (item.children) {
      return searchRouteDetail(path, item.children)
    }
  }
  return null
}

export * from './lazyLoad'
export * from './menu2Routes'
