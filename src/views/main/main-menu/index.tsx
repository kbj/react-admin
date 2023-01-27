import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import type { MenuProps } from 'antd'
import { Layout, Menu, theme } from 'antd'
import { LogoDivWrapper } from '@/views/main/style'
import Logo from '@/components/logo'
import { useUserStore } from '@/store/common'
import { useLocation, useNavigate } from 'react-router-dom'

interface IProps {
  children?: ReactNode
  collapsed?: boolean
}

const MainMenu: FC<IProps> = (props) => {
  const {
    token: { colorPrimaryBg }
  } = theme.useToken()
  const antdMenuList = useUserStore((state) => state.antdMenuList)
  const menuList = useUserStore.getState().menuList
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // 计算默认展开的列表id
  function getDefaultOpenKeys(path: string): string[] {
    const defaultSelectedKeys: string[] = []
    let startMenus = menuList.filter(
      (menu) => menu.url && ('/main' + path).indexOf(menu.url) > -1
    )
    while (startMenus && startMenus.length > 0) {
      if (startMenus[0].url) {
        defaultSelectedKeys.push(startMenus[0].url.replace('/main', ''))
      }
      startMenus =
        startMenus[0].children?.filter(
          (menu) => menu.url && ('/main' + path).indexOf(menu.url) > -1
        ) || []
    }
    return defaultSelectedKeys
  }

  // 菜单点击事件
  const menuClick: MenuProps['onClick'] = (menu) => {
    if (menu.key === pathname) {
      return
    }

    // 跳转
    navigate(menu.key)
  }

  // 查询当前激活的菜单
  const getActiveMenuList = (): string[] => {
    const activeMenus = antdMenuList.filter(item => item && item.key && pathname.indexOf(item.key as string) > -1)
    return []
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
        defaultSelectedKeys={[pathname]}
        defaultOpenKeys={getDefaultOpenKeys(pathname)}
        items={antdMenuList}
        onClick={menuClick}
      />
    </Layout.Sider>
  )
}

export default memo(MainMenu)
