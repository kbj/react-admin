import type { FormItemProps, SelectProps } from 'antd'
import type { PropsWithChildren } from 'react'
import type { IPageRequest } from '@/api/types/common'
import type { FormInstance } from 'antd/es/form/hooks/useForm'

/**
 * Props类型
 */
export interface IProps extends PropsWithChildren {
  // 表单配置文件
  config: TableSearchFormItem[]
  // 加载状态
  loading?: boolean
  // 提交查询方法
  query: <T extends IPageRequest>(data: T) => void
  form: FormInstance
}

/**
 * 表单类型枚举定义
 */
export enum FormItemType {
  Input,
  Date,
  DateTime,
  Select
}

export interface TableSearchFormItem {
  itemType: FormItemType // 表单类型
  label: string // 展示名称
  fieldName: string // 表单用的字段名称
  rules?: FormItemProps['rules'] // 表单校验规则
  hidden?: boolean // 是否隐藏
  default?: any // 默认值
  list?: SelectProps['options'] // 字典显示
}
