import * as React from 'react'

/**
 * 路由额外自定义信息
 */
export interface RouteMeta {
  /**
   * 是否需要登录
   */
  auth?: boolean

  /**
   * 路由标题
   */
  title?: string

  /**
   * 路由key
   */
  key?: string
}

/**
 * 自定义路由组件（与自定义信息合并后的新路由信息）
 */
export interface AuthRouteObject {
  index?: false
  path?: string
  element?: React.ReactNode | null
  errorElement?: React.ReactNode | null
  children?: AuthRouteObject[]
  meta?: RouteMeta
}
