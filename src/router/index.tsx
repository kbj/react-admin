import React, { FC, useEffect } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import 'nprogress/nprogress.css'
import nProgress from 'nprogress'
import { loginGuard } from '@/router/guard'
import { useRouteStore } from '@/store/common/route'

/**
 * 路由封装
 * @constructor
 */
const MyRouter: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const routeList = useRouteStore((state) => state.routeList)

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

  return useRoutes(routeList)
}

export default MyRouter
