import type {
  AntdMenuItem,
  AuthRouteObject,
  IMenuTreeList
} from '@/global/types/common'
import { lazyLoad } from '@/router/utils/lazyLoad'
import { BuildOutlined } from '@ant-design/icons'
import React from 'react'

/**
 * 将接口菜单转换为路由对象
 * @param menus 接口菜单列表
 */
export const convertMenuList = (
  menus: IMenuTreeList[]
): [AuthRouteObject[] | undefined, AntdMenuItem[] | undefined] => {
  const dynamicRoutes: AuthRouteObject[] = []

  return [dynamicRoutes, convertMenuList2Route(dynamicRoutes, menus)]
}

/**
 * 递归构建Antd菜单对象与注册路由的对象
 * @param dynamicRoutes
 * @param menus
 */
const convertMenuList2Route = (
  dynamicRoutes: AuthRouteObject[],
  menus: IMenuTreeList[]
): AntdMenuItem[] | undefined => {
  // 遍历到叶子为空或菜单类型为3时退出递归
  if (!menus || menus.length === 0 || menus[0].type === 3) {
    return undefined
  }

  const antdMenus: AntdMenuItem[] = []
  for (const menu of menus) {
    const url = (menu.url || '').replace('/main', '')

    // 构建antd菜单对象
    const menuItem = getItem(menu.name, url, <BuildOutlined />)

    if (menu.children && menu.children.length > 0) {
      ;(menuItem as any).children = convertMenuList2Route(
        dynamicRoutes,
        menu.children
      )
    } else {
      // 如果当前子路由是空的，说明是叶子节点，这时候需要添加link路由以及注册路由
      // ;(menuItem as any).label = <Link to={url}>{menu.name}</Link>
      dynamicRoutes.push({
        path: url,
        meta: { auth: true, title: menu.name, key: url },
        element: lazyLoad(url)
      })
    }
    antdMenus.push(menuItem)
  }
  return antdMenus
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: AntdMenuItem[],
  type?: 'group'
): AntdMenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as AntdMenuItem
}
