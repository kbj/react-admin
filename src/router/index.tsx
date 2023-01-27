import React, { FC, useEffect } from 'react'
import { convertMenuList } from '@/router/utils'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import 'nprogress/nprogress.css'
import nProgress from 'nprogress'
import { loginGuard } from '@/router/guard'
import { useUserStore } from '@/store/common'

/**
 * 路由封装
 * @constructor
 */
const MyRouter: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const menuList = useUserStore((state) => state.menuList)
  const updateAntdMenuList = useUserStore((state) => state.updateAntdMenuList)
  const dynamicRoutes = useUserStore((state) => state.dynamicRoutes)
  const updateDynamicRoutes = useUserStore((state) => state.updateDynamicRoutes)

  // 守卫相关
  useEffect(() => {
    nProgress.done()

    // 导入自定义的守卫
    {
      loginGuard(location, navigate) // 登录守卫
    }
    return () => {
      nProgress.start()
    }
  }, [location, navigate])

  // 路由菜单更新相关
  useEffect(() => {
    const [dynamicRoutes, antdMenus] = convertMenuList(menuList)
    updateDynamicRoutes(dynamicRoutes || [])

    updateAntdMenuList(antdMenus || [])
  }, [menuList])

  return useRoutes(dynamicRoutes)
}

export default MyRouter
