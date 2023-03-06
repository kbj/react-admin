import type { TableSearchFormItem } from '@/components/table-search-form/types'
import { FormItemType } from '@/components/table-search-form/types'
import type { ColumnsType } from 'antd/es/table'
import type { IUser } from '@/api/types/common'

/**
 * 用户管理搜索表单配置
 */
export const searchConfig: TableSearchFormItem[] = [
  {
    itemType: FormItemType.Input,
    label: '用户名',
    fieldName: 'username'
  },
  {
    itemType: FormItemType.Input,
    label: '手机号码',
    fieldName: 'mobile'
  },
  {
    itemType: FormItemType.Date,
    label: '创建时间',
    fieldName: 'createTime'
  }
]

/**
 * table表格配置
 */
export const tableConfig: ColumnsType<IUser> = [
  { title: '用户名', dataIndex: 'username', align: 'center' },
  { title: '手机号码', dataIndex: 'mobile', align: 'center' },
  { title: '性别', dataIndex: 'gender', align: 'center' }
]
