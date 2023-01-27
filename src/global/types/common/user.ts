/**
 * 菜单树结构
 */
export interface IMenuTree {
  list: IMenuTreeList[]
}

export interface IMenuTreeList {
  children?: IMenuTreeList[]
  icon?: string
  id: number
  sort: number
  name: string
  type: number
  createAt: string
  updateAt: string
  url?: string
}

/**
 * 角色信息
 */
export interface IRole {
  id: number
  name: string
  intro: string
  createAt: string
  updateAt: string
}

/**
 * 部门信息
 */
export interface IDepartment {
  id: number
  name: string
  parentId?: number
  createAt: string
  updateAt: string
  leader: string
}

/**
 * 用户信息
 */
export interface IUserInfo {
  id: number
  name: string
  realname: string
  cellphone: number
  enable: number
  createAt: string
  updateAt: string
  role: IRole
  department: IDepartment
}
