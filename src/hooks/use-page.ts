import { useState } from 'react'

export function usePage<T>() {
  // 当前页
  const [pageNum, setPageNum] = useState<number>(1)

  // 每页长度
  const [pageSize, setPageSize] = useState<number>(10)

  // 数据
  const [data, setData] = useState<T[]>([])

  return { pageNum, setPageNum, pageSize, setPageSize, data, setData }
}
