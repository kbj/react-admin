import type { ILogin } from "@/global/types/login";
import network from "@/api";
import type { ICommonResponse, IMenu, IUserInfo } from "@/global/types/common";

/**
 * 登录方法
 * @param data 数据
 */
export function login(data: ILogin) {
  return network.post<ICommonResponse<null>>({
    url: '/login',
    data
  })
}

/**
 * 用户信息
 */
export function getUserInfo() {
  return network.get<ICommonResponse<IUserInfo>>({
    url: '/user-info'
  })
}

/**
 * 查询用户菜单
 */
export function getMenus() {
  return network.get<ICommonResponse<IMenu[]>>({
    url: '/menus'
  })
}
