import type { MenuType } from '@/global/enums'

/**
 * 菜单
 */
export interface IMenu {
  id: number // 主键
  menuName: string // 菜单名称
  parentId: number // 父菜单ID
  orderNum: number // 排序
  menuType: MenuType // 菜单类型
  visible: boolean // 是否可见
  icon?: string
  createAt: string
  updateAt: string
  permissionFlag?: string // 权限标识
  path?: string // 路由地址
  component?: string // 组件地址
  isFrame?: boolean // 是否外链
  query?: string // 路由参数
  isCache?: boolean // 是否缓存
}

/**
 * 用户信息
 */
export interface IUserInfo {
  user: IUser
  roles: string[] // 角色
  permissions: string[] // 权限字符
}

export interface IUser {
  id: number
  username: string
  mobile: string
  deptId: number
  gender: string // 性别
  avatar: string // 头像
  nickName: string // 昵称
  email: string // 邮箱
}

export interface IResetPassword {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
