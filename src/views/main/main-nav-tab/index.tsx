import type { FC, ReactNode } from 'react'
import React, { memo, useEffect, useState } from 'react'
import { Tabs, theme } from 'antd'
import { DivWrapper } from '@/views/main/main-nav-tab/style'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNavTabStore, useUserStore } from '@/store/common'
import { searchRouteDetail } from '@/router/utils'
import type { NavTab } from '@/global/types/common/nav-tab'
import { KeepAliveContainer } from '@/global/keep-alive'

interface IProps {
  children?: ReactNode
}

const MainNavTab: FC<IProps> = () => {
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  const { pathname } = useLocation()
  const [activeKey, setActiveKey] = useState<string>(pathname) // 当前激活的路径
  const dynamicRoutes = useUserStore((state) => state.dynamicRoutes) // 动态路由信息
  const navTabs = useNavTabStore((state) => state.navTabs) // 标签页
  const addNavTabAction = useNavTabStore((state) => state.addNavTabAction) // 添加标签页
  const updateNavTabAction = useNavTabStore((state) => state.updateNavTabAction) // 更新标签页
  const navigate = useNavigate()

  useEffect(() => {
    addTab()
  }, [pathname])

  // 添加进tab选项
  const addTab = () => {
    if (pathname === '/') {
      return
    }
    // 根据当前路径查询路由对象
    const currentRoute = searchRouteDetail(pathname, dynamicRoutes)
    if (!currentRoute) {
      return
    }

    // 判断是否已存在
    if (navTabs.filter((tabs) => tabs.path.indexOf(pathname) > -1).length < 1) {
      // 不存在添加进tab列表中
      addNavTabAction({
        title: currentRoute.meta?.title || pathname,
        path: pathname
      })
    }

    // 设置当前激活的标签页值
    setActiveKey(pathname)
  }

  /**
   * 删除点击事件
   * @param key 删除的key
   */
  const clickDelete = (key: string) => {
    const copyNavTabs = JSON.parse(JSON.stringify(navTabs)) as NavTab[]
    const index = copyNavTabs.findIndex((tab) => tab.path === key)
    if (index < 0) {
      return
    }

    // 删除第一个跳转到第二个去，删除其他的往左边跳转
    const nextPath =
      index === 0 ? copyNavTabs[1].path : copyNavTabs[index - 1].path
    copyNavTabs.splice(index, 1)
    updateNavTabAction(copyNavTabs)

    nextPath !== pathname && navigate(nextPath)

    // 将缓存删除
    KeepAliveContainer.remove(key)
  }

  /**
   * 右键功能
   * @param event 事件
   */
  const rightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {}

  return (
    <>
      <DivWrapper
        primaryColor={colorPrimary}
        backGroundColor={colorBgContainer}
      >
        <Tabs
          type="editable-card"
          hideAdd
          animated
          activeKey={activeKey}
          onContextMenu={rightClick}
          items={navTabs.map((tab) => ({
            key: tab.path,
            label: tab.title,
            closable: navTabs.length > 1
          }))}
          onEdit={(key) => clickDelete(key as string)}
          onChange={(e) => navigate(e)}
        />
      </DivWrapper>
    </>
  )
}

export default memo(MainNavTab)
