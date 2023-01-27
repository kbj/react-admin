import type { ILogin, ILoginResponse } from '@/global/types/login'
import network from '@/api'
import { ICommonResponse, IUserInfo } from '@/global/types/common'

/**
 * 登录方法
 * @param data 数据
 */
export function login(data: ILogin) {
  return network.post<ICommonResponse<ILoginResponse>>({
    url: '/login',
    data
  })
}

/**
 * 用户信息
 * @param userId 用户ID
 */
export function getUserInfo(userId: number) {
  return network.get<ICommonResponse<IUserInfo>>({
    url: '/users/' + userId
  })
}
