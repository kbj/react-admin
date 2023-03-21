import type { PropsWithChildren } from 'react'
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
  data: ICommonPageResponse

  // 分页改变方法
  pageChange?: (page: IPageRequest) => void
}
