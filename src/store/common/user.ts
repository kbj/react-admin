import { create, StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { IUserInfo } from '@/global/types/common'
import produce from 'immer'

const STORE_NAME = 'user-store'

/**
 * 用户信息需要持久化的状态
 */
interface IPersistStoreState {
  // 用户Token
  token: string
}
interface IPersistStore extends IPersistStoreState {
  setToken: (val: string) => void
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
    userInfo: undefined,
    setToken: (val) => set(() => ({ token: val })),
    reset: () =>
      set(() => ({
        token: '',
        userInfo: undefined
      }))
  }),
  { name: STORE_NAME }
)

/****************************************/

/**
 * 用户信息不需要持久化保存的状态
 */
interface IUserStoreState {
  userInfo?: IUserInfo // 用户信息
  loading: boolean // 全局加载框
}
interface IUserStore extends IUserStoreState {
  updateUserInfo: (userInfo: IUserInfo) => void
  updateLoading: (loading: boolean) => void
}

const userStore: StateCreator<
  IUserStore & IPersistStore,
  [],
  [],
  IUserStore
> = (set, get) => ({
  navTabs: [],
  userInfo: undefined,
  loading: false,
  updateUserInfo: (userInfo: IUserInfo) =>
    set(
      produce((preState) => {
        preState.userInfo = userInfo
      })
    ),
  updateLoading: (loading: boolean) => set(() => ({ loading }))
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
