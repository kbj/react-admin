// 字典搜索表单
export interface IDictSearch {
  dictName: string
  dictType: string
  enabled: boolean
}

// 字典列表
export interface IDictList {
  // 主键
  id: number
  // 字典名称
  dictName: string
  // 字典类型
  dictType: string
  // 是否启用
  enabled: boolean
  // 创建时间
  createTime: number
}
