import { useState } from 'react'

export function usePage() {
  const [pageNum, setPageNum] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [data, setData] = useState<any[]>([])
  return { pageNum, setPageNum, pageSize, setPageSize, data, setData }
}
