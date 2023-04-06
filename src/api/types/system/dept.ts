// 部门搜索条件
export interface IDeptSearch {
  deptName?: string
  enabled?: string
}

// 部门列表字段
export interface IDeptList {
  id: number
  deptName: string // 部门名称
  parentId: number // 父ID
  ancestors: string // 祖级列表
  orderNum: number // 排序
  leaderUserId: number // 负责人ID
  enabled: string // 是否启用
  children?: IDeptList[] // 子级结构
}

// 部门表单
export interface IDeptForm {
  id?: number
  parentId: number // 上级部门
  deptName: string // 部门名称
  orderNum: number // 排序
  leaderUserId?: number // 负责人ID
  enabled: string // 是否启用
}
