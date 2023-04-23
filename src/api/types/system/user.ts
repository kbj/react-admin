import { IPageRequest } from '@/api/types/common'

/**
 * 用户列表搜索
 */
export interface IUserRequest extends IPageRequest {
  username?: string // 用户名
  mobile?: string // 手机号
  createTime?: number[] // 创建时间
  enabled?: string // 是否启用
}

/**
 * 用户表单
 */
export interface IUserForm {
  id?: number
  username: string
  password: string
  nickName: string
  mobile: string
  deptId: number
  gender: string
  avatar: string
  enabled: string
  email: string
  roles: number[]
}
