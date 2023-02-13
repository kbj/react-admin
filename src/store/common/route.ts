import type {
  AntdMenuItem,
  AuthRouteObject,
  IMenu
} from '@/global/types/common'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { lazyLoad, menu2AntdMenu, menu2Routes } from '@/router/utils'
import produce from 'immer'

// 定义要注册的路由
const globalRouters: AuthRouteObject[] = [
  {
    path: '/',
    element: lazyLoad('/main'),
    meta: { title: '首页' },
    children: []
  },
  {
    path: '/login',
    meta: { title: '登录', anonymous: true },
    element: lazyLoad('/login')
  },
  {
    path: '*',
    meta: { title: '404', anonymous: true },
    element: lazyLoad('/not-found')
  }
]

/**
 * 路由相关的Store
 */
interface IRouteStoreState {
  menuList: IMenu[] // 菜单列表
  routeList: AuthRouteObject[] // react-router路由注册对象列表
  antdMenuList: AntdMenuItem[] // antd所使用的导航菜单的对象
}
interface IRouteStore extends IRouteStoreState {
  updateMenuList: (lists: IMenu[]) => void
}
export const useRouteStore = create<IRouteStore>()(
  devtools(
    (set) => ({
      menuList: [],
      routeList: globalRouters,
      antdMenuList: [],
      updateMenuList: (lists) =>
        set(
          produce((preState) => {
            preState.menuList = lists // 原始接口菜单列表
            preState.routeList[0].children = menu2Routes(lists) // 更新注册路由地址
            preState.antdMenuList = menu2AntdMenu(lists) // antd所使用的导航菜单的对象
          })
        )
    }),
    { name: 'route-store' }
  )
)
