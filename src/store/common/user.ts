import { create, StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  AuthRouteObject,
  IMenuTreeList,
  IUserInfo
} from '@/global/types/common'
import { menuTreeList } from '@/api/main'
import { getUserInfo } from '@/api/login'
import type { ItemType } from 'antd/lib/menu/hooks/useItems'
import { convertMenuList, lazyLoad } from '@/router/utils'
import produce from 'immer'

const STORE_NAME = 'user-store'

// 默认路由注册信息
function createDefaultRoutes(children: AuthRouteObject[] = []) {
  const init: AuthRouteObject[] = [
    {
      path: '/',
      element: lazyLoad('/main'),
      meta: { auth: true },
      children: children
    },
    {
      path: '/login',
      element: lazyLoad('/login')
    }
  ]
  return init
}

/**
 * 用户信息需要持久化的状态
 */
interface IPersistStoreState {
  // 用户Token
  token: string

  userId?: number

  // 用户信息
  userInfo?: IUserInfo

  // 菜单列表
  menuList: IMenuTreeList[]
}

interface IPersistStore extends IPersistStoreState {
  setToken: (val: string) => void
  setUserId: (val: number) => void
  updateUserInfo: (id: number) => void
  reset: () => void
}

const userPersistStore: StateCreator<
  IPersistStore & IUserStore,
  [],
  [['zustand/persist', IPersistStore]],
  IPersistStore
> = persist(
  (set) => ({
    token: '',
    userId: undefined,
    userInfo: undefined,
    menuList: [],
    setToken: (val) => set(() => ({ token: val })),
    setUserId: (val) => set(() => ({ userId: val })),
    updateUserInfo: async (id: number) => {
      // 查询用户信息
      const resp = await getUserInfo(id)
      if (resp && resp.data) {
        set(() => ({ userInfo: resp.data }))

        // 查询菜单信息
        const list = await menuTreeList(resp.data.role.id)
        if (list && list.data) {
          set(() => ({ menuList: list.data }))
        }
      }
    },
    reset: () =>
      set(() => ({
        antdMenuList: [],
        token: '',
        userId: undefined,
        userInfo: undefined,
        menuList: []
      }))
  }),
  { name: STORE_NAME }
)

/****************************************/

/**
 * 用户信息不需要持久化保存的状态
 */
interface IUserStoreState {
  antdMenuList: ItemType[] // antd菜单列表
  dynamicRoutes: AuthRouteObject[] // 动态路由注册信息
}

interface IUserStore extends IUserStoreState {
  updateAntdMenuList: (lists: ItemType[]) => void
  updateDynamicRoutes: (lists: AuthRouteObject[]) => void
}

const userStore: StateCreator<
  IUserStore & IPersistStore,
  [],
  [],
  IUserStore
> = (set, get) => ({
  antdMenuList: [],
  dynamicRoutes: createDefaultRoutes(convertMenuList(get().menuList)[0] || []),
  navTabs: [],
  updateAntdMenuList: (lists) => set(() => ({ antdMenuList: lists })),
  updateDynamicRoutes: (lists) =>
    set(
      produce((preState) => {
        preState.dynamicRoutes[0].children = lists
      })
    )
})

/****************************************/

/**
 * 导出总的store
 */
export const useUserStore = create<IPersistStore & IUserStore>()(
  devtools(
    (...a) => ({
      ...userPersistStore(...a),
      ...userStore(...a)
    }),
    { name: STORE_NAME }
  )
)
