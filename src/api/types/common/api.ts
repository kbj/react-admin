export interface ICommonResponse<T = any> {
  code: number
  msg: string
  data: T
}

export interface ICommonPageResponse<T = any> {
  records: T
  total: number
  pageSize: number
  pageNum: number
}

export interface IPageRequest {
  pageNum: number //当前页
  pageSize: number // 每页大小
  orderBy?: string // 排序规则
  isDesc?: boolean // 是否倒叙
}
