import type { ReactNode } from 'react'

/**
 * 路由额外自定义信息
 */
export interface RouteMeta {
  /**
   * 是否匿名访问
   */
  anonymous?: boolean

  /**
   * 路由标题
   */
  title?: string

  /**
   * 路由key
   */
  key?: string

  /**
   * 路由树中各层ID
   */
  treePath?: string[]

  /**
   * 是否缓存
   */
  isCache?: boolean
}

/**
 * 自定义路由组件（与自定义信息合并后的新路由信息）
 */
export interface AuthRouteObject {
  index?: false
  path?: string
  element?: ReactNode | null
  errorElement?: ReactNode | null
  children?: AuthRouteObject[]
  meta?: RouteMeta
}
