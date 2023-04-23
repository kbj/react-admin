import { IPageRequest } from '@/api/types/common'

/**
 * 角色搜索表单
 */
export interface IRoleSearch extends IPageRequest {
  roleName?: string // 角色名称
  roleKey?: string // 权限字符
  enabled?: string // 状态
}

/**
 * 角色列表
 */
export interface IRoleList {
  id: number
  roleName: string
  roleKey: string
  enabled: string
  createAt: number
  orderNum: number
}

/**
 * 角色表单
 */
export interface IRoleForm {
  id: number
  roleName: string
  roleKey: string
  enabled: string
  orderNum: number
  menus?: number[] // 菜单ID
}
