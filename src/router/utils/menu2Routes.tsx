import type { AntdMenuItem, AuthRouteObject, IMenu } from '@/api/types/common'
import { lazyLoad } from '@/router/utils/lazyLoad'
import type { Key, ReactNode } from 'react'
import { MenuType } from '@/global/enums'
import { iconToElement } from '@/utils/icon'

/**
 * 接口返回的菜单列表生成ReactRouter所需的路由对象
 * @param menuLists 接口返回菜单列表
 */
export const menu2Routes = (
  menuLists: IMenu[]
): AuthRouteObject[] | undefined => {
  return (
    menuLists
      // 路由只需要提取是菜单类型
      .filter((menu) => menu.menuType === MenuType.MENU && menu.component)
      .map((menu) => {
        const [fullPath, treePath] = getFullPath(menuLists, menu.parentId)
        return {
          path: fullPath + menu.path,
          element: lazyLoad(menu.component as string),
          meta: { title: menu.menuName, key: menu.id + '', treePath }
        }
      })
  )
}

/**
 * 递归查询路由完整路径
 * @param menuLists 菜单列表
 * @param parentId  父菜单
 * @param fullPath  生成的全路径
 * @param treePath [string, string[]] [完整路由路径，层级菜单ID]
 */
function getFullPath(
  menuLists: IMenu[],
  parentId: number,
  fullPath: string = '/',
  treePath: string[] = []
): [string, string[]] {
  if (parentId === 0 || !parentId) {
    return [fullPath, treePath]
  }

  for (const menu of menuLists) {
    if (menu.id === parentId) {
      fullPath = '/' + menu.path + fullPath
      treePath.push(menu.id + '')
      return getFullPath(menuLists, menu.parentId, fullPath, treePath)
    }
  }
  return [fullPath, treePath]
}

/**
 * 将接口返回菜单列表生成Antd导航菜单所需的菜单树结构
 * @param menuList  菜单列表
 * @param parentId 初始父ID
 */
export function menu2AntdMenu(
  menuList: IMenu[],
  parentId: number = 0
): AntdMenuItem[] | undefined {
  const item = menuList
    .filter(
      (menu) =>
        menu.parentId === parentId &&
        menu.menuType !== MenuType.BUTTON &&
        menu.path &&
        menu.visible
    )
    .map((menu) => {
      return getItem(
        menu.menuName,
        menu.id + '',
        menu.icon ? iconToElement(menu.icon) : undefined,
        menu2AntdMenu(menuList, menu.id)
      )
    })
  return item && item.length > 0 ? item : undefined
}

function getItem(
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
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
