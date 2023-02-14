import type { IUserRequest } from '@/api/types/system/user'
import api from '@/api'
import type {
  ICommonPageResponse,
  ICommonResponse,
  IPageRequest,
  IUser
} from '@/api/types/common'

/**
 * 用户列表请求接口
 * @param data  用户列表
 */
export function getUserList(data: IUserRequest & IPageRequest) {
  return api.get<ICommonResponse<ICommonPageResponse<IUser[]>>>({
    url: '/system/user/list',
    params: data
  })
}
