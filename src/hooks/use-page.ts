import { useState } from 'react'
import { useRequest } from 'ahooks'
import type { ICommonPageResponse, ICommonResponse } from '@/api/types/common'

/**
 * 自定义通用列表查询Hooks
 * @param service API请求方法
 */
export function usePage<T>(service: (...args: any[]) => Promise<ICommonResponse<ICommonPageResponse<T>>>) {
  // 当前页
  const [pageNum, setPageNum] = useState<number>(1)

  // 每页长度
  const [pageSize, setPageSize] = useState<number>(10)

  // 数据
  const [data, setData] = useState<ICommonPageResponse<T>>({ pageNum, pageSize, total: 0, records: [] })

  // 查询列表结果封装
  const { loading, run } = useRequest(service, {
    manual: true,
    loadingDelay: 100,
    onSuccess: (resp) => {
      setPageNum(resp.data.pageNum)
      setPageSize(resp.data.pageSize)
      setData(resp.data)
    }
  })

  return { pageNum, setPageNum, pageSize, setPageSize, data, setData, loading, run }
}
