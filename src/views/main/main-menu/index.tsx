import type { FC, ReactNode } from 'react'
import React, { memo, useLayoutEffect, useState } from 'react'
import type { MenuProps } from 'antd'
import { Layout, Menu, theme } from 'antd'
import { LogoDivWrapper } from '@/views/main/style'
import Logo from '@/components/logo'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRouteStore } from '@/store/common/route'
import { searchRouteDetail } from '@/router/utils'
import { useUpdateLayoutEffect } from 'ahooks'

let cacheOpenKeys: string[] = []

interface IProps {
  children?: ReactNode
  collapsed?: boolean
}
const MainMenu: FC<IProps> = (props) => {
  const {
    token: { colorPrimaryBg }
  } = theme.useToken()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const antdMenuList = useRouteStore((state) => state.antdMenuList)
  const routeList = useRouteStore((state) => state.routeList)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // 监控当前路径匹配导航菜单展开选中状态
  useLayoutEffect(() => {
    const routeDetail = searchRouteDetail(pathname, routeList[0].children || [])
    if (routeDetail) {
      // 更新展开的Key
      setOpenKeys(routeDetail.meta?.treePath || [])
      // 更新选中Key
      setSelectedKeys([routeDetail.meta?.key || '/'])
    }
  }, [pathname])

  // 监控菜单栏折叠情况
  useUpdateLayoutEffect(() => {
    if (props.collapsed) {
      cacheOpenKeys = [...openKeys]
    } else {
      // 使用延迟展开解决立即展开时候会出现的闪屏问题
      setTimeout(() => setOpenKeys([...cacheOpenKeys]), 100)
    }
  }, [props.collapsed])

  // 菜单点击事件
  const menuClick: MenuProps['onClick'] = (menu) => {
    const businessRoutes = routeList[0].children
    if (!businessRoutes) {
      return
    }

    for (let route of businessRoutes) {
      if (route.meta?.key === menu.key) {
        const path = route.path || '/'
        if (path === pathname) {
          return
        }
        // 跳转
        navigate(path)
        break
      }
    }
  }

  return (
    <Layout.Sider trigger={null} collapsible collapsed={!!props.collapsed}>
      <LogoDivWrapper>
        <Logo
          collapsed={!!props.collapsed}
          color={colorPrimaryBg}
          fontSize={'1.8rem'}
          logoSize={props.collapsed ? 4.8 : 3.2}
        />
      </LogoDivWrapper>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(openKeys) => setOpenKeys(openKeys)}
        items={antdMenuList}
        onClick={menuClick}
      />
    </Layout.Sider>
  )
}

export default memo(MainMenu)
