import type { MenuType } from '@/global/enums'

/**
 * 菜单搜索表单
 */
export interface IMenuSearch {
  menuName?: string
  enabled?: string
}

/**
 * 菜单列表
 */
export interface IMenuList {
  id: number
  menuName: string // 菜单名称
  parentId: number // 父菜单ID
  orderNum: number // 菜单顺序
  menuType: MenuType // 菜单类型(C目录M菜单B按钮)
  path: string // 路由地址
  component: string // 组件地址
  visible: boolean // 是否可见
  enabled: string // 是否启用
  permissionFlag: string // 权限标识
  icon: string // 图标
  isFrame: string // 是否外链
  query: string // 路由参数
  isCache: boolean // 是否缓存
  children?: IMenuList[] // 子级结构
}

/**
 * 菜单表单
 */
export interface IMenuForm {
  id: number
  menuName: string // 菜单名称
  parentId?: number // 父菜单ID
  orderNum: number // 菜单顺序
  menuType: MenuType // 菜单类型(C目录M菜单B按钮)
  path?: string // 路由地址
  component?: string // 组件地址
  visible?: boolean // 是否可见
  enabled: string // 是否启用
  permissionFlag?: string // 权限标识
  isFrame?: string // 是否外链
  icon?: string // 图标
  query?: string // 路由参数
  isCache?: boolean // 是否缓存
}
