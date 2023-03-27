//递归查询对应的路由
import type { AuthRouteObject } from '@/api/types/common'

/**
 * 递归查询对应路由对象信息
 * @param path    当前访问地址
 * @param routes  全局路由信息
 */
export const searchRouteDetail = (path: string, routes: AuthRouteObject[]): AuthRouteObject | null => {
  if (!routes || routes.length === 0) {
    return null
  }

  for (const item of routes) {
    if (item.path === path) {
      return item
    } else if (item.path && item.path.indexOf(':') > -1) {
      // 有路由参数的情况
      const paramIndex = item.path.indexOf(':')
      if (path.length - 1 >= paramIndex && item.path.slice(0, paramIndex) === path.slice(0, paramIndex)) {
        // 判断参数前的地址是否一致
        return item
      }
    }
    if (item.children) {
      searchRouteDetail(path, item.children)
    }
  }
  return null
}

export * from './lazyLoad'
export * from './menu2Routes'
