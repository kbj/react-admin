import { searchRouteDetail } from '@/router/utils'
import type { Location, NavigateFunction } from 'react-router-dom'
import { useUserStore } from '@/store/common'
import { message } from 'antd'
import { useRouteStore } from '@/store/common/route'

/**
 * 登录守卫
 * @constructor
 */
export function loginGuard(location: Location, navigate: NavigateFunction) {
  const routeList = useRouteStore.getState().routeList
  //找到对应的路由信息
  const routeDetail = searchRouteDetail(location.pathname, routeList)

  //默认需要登录校验
  if (routeDetail && routeDetail.meta?.anonymous) {
    return
  } else if (!useUserStore.getState().token) {
    message.warning('请登录')
    navigate('/login')
  }
}
