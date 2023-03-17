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

// 字典值类型
export interface IDictData {
  // 字典类型
  dictType: string
  // 字典值名称
  dictLabel?: string
  // 字典值
  dictValue?: string
  // 是否启用
  enabled?: boolean
  // 标签显示类型
  tagType?: string
  // 排序
  dictSort?: number
}
