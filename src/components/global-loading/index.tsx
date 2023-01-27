import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import { Spin } from 'antd'

interface IProps {
  children?: ReactNode
}

/**
 * 全局加载组件
 * @constructor
 */
const GlobalLoading: FC<IProps> = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        zIndex: 99999,
        background: 'rgba(24,144,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Spin size="large" />
    </div>
  )
}

export default memo(GlobalLoading)
