import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { Layout } from 'antd'
import KeepAlive from '@/components/keep-alive'

interface IProps {
  children?: ReactNode
}

const MainContent: FC<IProps> = () => {
  const outlet = useOutlet()
  const location = useLocation()

  return (
    <Layout.Content
      style={{
        margin: '1.8rem 1.6rem',
        minHeight: 280
      }}
    >
      <KeepAlive activeName={location.pathname}>{outlet}</KeepAlive>
    </Layout.Content>
  )
}

export default memo(MainContent)
