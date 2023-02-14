import type { FormItemProps } from 'antd'

/**
 * 表单类型枚举定义
 */
export enum FormItemType {
  Input,
  Date,
  DateTime
}

export interface TableSearchFormItem {
  itemType: FormItemType // 表单类型
  label: string // 展示名称
  fieldName: string // 表单用的字段名称
  rules?: FormItemProps['rules'] // 表单校验规则
  hidden?: boolean // 是否隐藏
  default?: any // 默认值
}
