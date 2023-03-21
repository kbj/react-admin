import type { IUserRequest } from '@/api/types/system/user'
import api from '@/api'
import type { ICommonPageResponse, ICommonResponse, IUser } from '@/api/types/common'

// 用户列表
export function getUserList(data: IUserRequest) {
  return api.get<ICommonResponse<ICommonPageResponse<IUser>>>({
    url: '/system/user/list',
    params: data
  })
}
