import type { FC, PropsWithChildren } from 'react'
import React, { memo, useEffect, useState } from 'react'
import type { MenuProps, TabsProps } from 'antd'
import { Dropdown, message, Tabs, theme } from 'antd'
import { DivWrapper } from '@/views/main/main-nav-tab/style'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNavTabStore } from '@/store/common'
import { searchRouteDetail } from '@/router/utils'
import type { NavTab } from '@/api/types/common'
import { KeepAliveContainer } from '@/global/keep-alive'
import { useRouteStore } from '@/store/common/route'
import { ArrowLeftOutlined, ArrowRightOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons'

// 标签页右键菜单
const rightClickMenuItems: MenuProps['items'] = [
  {
    label: '关闭当前',
    key: '1',
    icon: <CloseOutlined />
  },
  {
    label: '关闭其他',
    key: '2',
    icon: <CloseCircleOutlined />
  },
  {
    label: '关闭左侧',
    key: '3',
    icon: <ArrowLeftOutlined />
  },
  {
    label: '关闭右侧',
    key: '4',
    icon: <ArrowRightOutlined />
  },
  {
    label: '全部关闭',
    key: '5',
    icon: <CloseCircleOutlined />
  }
]

/**
 * 导航标签页
 */
const MainNavTab: FC<PropsWithChildren> = () => {
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()
  const { pathname } = useLocation()
  const [activeKey, setActiveKey] = useState<string>(pathname) // 当前激活的路径
  const routeList = useRouteStore((state) => state.routeList) // 动态路由信息
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
    const currentRoute = searchRouteDetail(pathname, routeList[0].children || [])
    if (!currentRoute) {
      return
    }

    // 判断是否已存在
    if (navTabs.filter((tabs) => tabs.path === pathname).length < 1) {
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
    const nextPath = index === 0 ? copyNavTabs[1].path : copyNavTabs[index - 1].path
    copyNavTabs.splice(index, 1)
    updateNavTabAction(copyNavTabs)

    nextPath !== pathname && navigate(nextPath)

    // 将缓存删除
    KeepAliveContainer.remove(key)
  }

  /**
   * 右键功能
   */
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => {
    return (
      <Dropdown menu={{ items: rightClickMenuItems, onClick: handleMenuClick }} trigger={['contextMenu']}>
        <div>
          <DefaultTabBar {...props} />
        </div>
      </Dropdown>
    )
  }
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    message.info('Click on menu item.')
    console.log('click', e)
  }

  return (
    <>
      <DivWrapper primaryColor={colorPrimary} backGroundColor={colorBgContainer}>
        <Tabs
          type="editable-card"
          hideAdd
          animated
          activeKey={activeKey}
          // renderTabBar={renderTabBar}
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
