import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import { useAsyncEffect } from 'ahooks'
import ReactDOM from 'react-dom/client'
import GlobalLoading from '@/components/global-loading'
import { getMenus, getUserInfo } from '@/api/login'
import { useUserStore } from '@/store/common'
import { useRouteStore } from '@/store/common/route'
import MyRouter from '@/router'

interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = () => {
  const updateUserInfo = useUserStore((state) => state.updateUserInfo)
  const updateLoading = useUserStore((state) => state.updateLoading)
  const updateMenuList = useRouteStore((state) => state.updateMenuList)
  useAsyncEffect(async () => {
    await initUserInfo()
  }, [])

  const initUserInfo = async () => {
    if (!useUserStore.getState().userInfo && useUserStore.getState().token) {
      updateLoading(true)

      // 请求更新用户信息
      const userInfo = await getUserInfo()
      updateUserInfo(userInfo.data)
      // 更新菜单
      const menuList = await getMenus()
      updateMenuList(menuList.data)

      updateLoading(false)
    }
  }

  return (
    <>
      <GlobalLoading />
      <MyRouter />
    </>
  )
}

// 显示全局加载框
function showGlobalLoading() {
  hideGlobalLoading()
  const loading = document.createElement('div')
  loading.setAttribute('id', 'global-loading')
  document.body.appendChild(loading)
  ReactDOM.createRoot(loading).render(<GlobalLoading />)
}

// 移除全局加载
function hideGlobalLoading() {
  const loading = document.getElementById('global-loading')
  if (loading) {
    document.body.removeChild(loading)
  }
}

export default memo(App)
