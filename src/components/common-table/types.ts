import type { Dispatch, Key, PropsWithChildren, SetStateAction } from 'react'
import type { ColumnsType } from 'antd/es/table'
import type { ICommonPageResponse, IPageRequest } from '@/api/types/common'

export interface IProps extends PropsWithChildren {
  // rowKey
  rowKey?: string

  // 加载状态
  loading?: boolean

  // table列配置
  columns: ColumnsType<any>

  // table展示的数据
  data: ICommonPageResponse | any[]

  // 分页改变方法
  pageChange?: (page: IPageRequest) => void

  // 多选选中的Key
  selectedRowKeys?: Key[]

  // 多选变动事件
  setSelectedRowKeys?: Dispatch<SetStateAction<Key[]>>

  // 树列表情况下展开的Key
  expandedRowKeys?: readonly Key[]

  // 树列表情况下展开状态变更方法
  onExpandedRowsChange?: (keys: readonly Key[]) => void
}
