import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import { Spin } from 'antd'
import { useUserStore } from '@/store/common'

interface IProps {
  children?: ReactNode
}

/**
 * 全局加载组件
 * @constructor
 */
const GlobalLoading: FC<IProps> = (props) => {
  const loading = useUserStore((state) => state.loading)
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: loading ? 'flex' : 'none',
        zIndex: 99999,
        background: 'rgba(24,144,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Spin tip="正在加载..." size="large" spinning={loading}>
        {props.children}
      </Spin>
    </div>
  )
}

export default memo(GlobalLoading)
