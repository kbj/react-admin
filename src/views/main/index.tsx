import type { FC, ReactNode } from 'react'
import React, { memo, useLayoutEffect, useState } from 'react'
import { Layout } from 'antd'
import MainMenu from '@/views/main/main-menu'
import MainHeader from '@/views/main/main-header'
import MainContent from '@/views/main/main-content'
import { useUserStore } from '@/store/common'
import MainNavTab from '@/views/main/main-nav-tab'

interface IProps {
  children?: ReactNode
}

const Main: FC<IProps> = () => {
  const [collapsed, setCollapsed] = useState(false)
  const updateUserInfo = useUserStore((state) => state.updateUserInfo)
  const userId = useUserStore((state) => state.userId)

  useLayoutEffect(() => {
    // 请求更新用户信息
    userId && updateUserInfo(userId)
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/*侧边栏部分*/}
      <MainMenu collapsed={collapsed} />

      <Layout className="site-layout">
        <MainHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <MainNavTab />
        <MainContent />
      </Layout>
    </Layout>
  )
}

export default memo(Main)
