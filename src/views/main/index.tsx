import type { FC, ReactNode } from 'react'
import React, { memo, useEffect, useState } from 'react'
import { Layout } from 'antd'
import MainMenu from '@/views/main/main-menu'
import MainHeader from '@/views/main/main-header'
import MainContent from '@/views/main/main-content'
import MainNavTab from '@/views/main/main-nav-tab'
import { useLocation, useNavigate } from 'react-router-dom'

interface IProps {
  children?: ReactNode
}

const Main: FC<IProps> = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // 自动跳转首页
    if (location.pathname === '/main' || location.pathname === '/') {
      navigate('/main/home')
    }
  }, [location.pathname])

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
