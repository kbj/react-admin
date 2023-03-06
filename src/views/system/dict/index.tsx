import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import { usePage } from '@/hooks/use-page'

interface IProps {
  children?: ReactNode
}

/**
 * 字典管理
 */
const Dict: FC<IProps> = () => {
  const { data, pageNum, pageSize, setData, setPageNum, setPageSize } = usePage()
  return <></>
}

export default memo(Dict)
