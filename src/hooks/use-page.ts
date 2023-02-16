import { useState } from 'react'

export function usePage<T>() {
  const [pageNum, setPageNum] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [data, setData] = useState<T[]>([])
  return { pageNum, setPageNum, pageSize, setPageSize, data, setData }
}
