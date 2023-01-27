import { searchRouteDetail } from "@/router/utils";
import type { Location, NavigateFunction } from "react-router-dom";
import { useUserStore } from "@/store/common";
import { message } from "antd";

/**
 * 登录守卫
 * @constructor
 */
export function loginGuard(location: Location, navigate: NavigateFunction) {
  //找到对应的路由信息
  const routeDetail = searchRouteDetail(
    location.pathname,
    useUserStore.getState().dynamicRoutes
  )

  //如果需要权限验证
  if (routeDetail && routeDetail.meta?.auth) {
    if (!useUserStore.getState().token || !useUserStore.getState().userId) {
      message.warning('请登录')
      navigate('/login')
    }
  }
}
