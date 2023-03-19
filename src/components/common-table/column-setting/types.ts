import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { ColumnsType } from 'antd/es/table'

export interface IProps extends PropsWithChildren {
  /*是否禁用*/
  disabled?: boolean

  /*列设置*/
  columns: ColumnsType<any>

  /*实际表格列*/
  tableColumn: ColumnsType<any>

  /*更新实际表格列的方法类型*/
  setTableColumn: Dispatch<SetStateAction<ColumnsType<any>>>
}
