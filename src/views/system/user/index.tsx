import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'

interface IProps {
  children?: ReactNode
}

const User: FC<IProps> = () => {
  return <>用户管理</>
}

export default memo(User)
