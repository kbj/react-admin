import { create } from 'zustand'
import type { NavTab } from '@/global/types/common/nav-tab'
import { devtools } from 'zustand/middleware'
import produce from 'immer'

/**
 * 标签页相关的store
 */
interface INavTabStoreState {
  navTabs: NavTab[] // 标签页列表数据
}

interface INavTabStore extends INavTabStoreState {
  addNavTabAction: (tab: NavTab) => void // 增加标签页
  updateNavTabAction: (tabs: NavTab[]) => void // 删除标签页
}

export const useNavTabStore = create<INavTabStore>()(
  devtools(
    (set) => ({
      navTabs: [],
      addNavTabAction: (tab) =>
        set(
          produce((preState) => {
            preState.navTabs.push(tab)
          })
        ),
      updateNavTabAction: (tabs) =>
        set(
          produce((preState) => {
            preState.navTabs = tabs
          })
        )
    }),
    { name: 'nav-tab-store' }
  )
)
