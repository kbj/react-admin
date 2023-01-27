import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import { useOutlet } from 'react-router-dom'
import { Layout } from 'antd'
import KeepAlive from '@/components/keep-alive'

interface IProps {
  children?: ReactNode
}

const MainContent: FC<IProps> = () => {
  const outlet = useOutlet()

  return (
    <Layout.Content
      style={{
        margin: '1.8rem 1.6rem',
        minHeight: 280
      }}
    >
      <KeepAlive exclude={['/login']}>{outlet}</KeepAlive>
    </Layout.Content>
  )
}

export default memo(MainContent)
