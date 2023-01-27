import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'

interface IProps {
  children?: ReactNode
}

const System: FC<IProps> = () => {
  return <div>系统管理</div>
}

export default memo(System)
