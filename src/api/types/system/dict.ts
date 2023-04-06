// 字典搜索表单
import type { IPageRequest } from '@/api/types/common'

// 字典列表搜索表单
export interface IDictSearch extends IPageRequest {
  dictName?: string
  dictType?: string
  enabled?: string
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
  enabled: string
  // 创建时间
  createTime: number
}

// 字典表单
export interface IDictForm {
  id?: number
  dictName: string
  dictType: string
  enabled: string
}

// 字典值类型搜索表单
export interface IDictDataSearch extends IPageRequest {
  // 字典类型
  dictType?: string
  // 字典值名称
  dictLabel?: string
  // 是否启用
  enabled?: string
}

// 字典值类型
export interface IDictData {
  // 主键
  id: number
  // 字典类型
  dictType: string
  // 字典值名称
  dictLabel?: string
  // 字典值
  dictValue?: string
  // 是否启用
  enabled?: string
  // 标签显示类型
  tagType?: string
  // 排序
  dictSort?: number
}

// 字典值表单
export interface IDictDataForm {
  id?: number // 主键
  dictType: string // 字典类型
  dictLabel: string // 字典标签
  dictValue: string // 字典键值
  dictSort: number // 排序
  tagType?: string // 标签样式类型
}
