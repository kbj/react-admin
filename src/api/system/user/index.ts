import type { IUserForm, IUserRequest } from '@/api/types/system/user'
import api from '@/api'
import type { ICommonPageResponse, ICommonResponse, IUser } from '@/api/types/common'

// 用户列表
export function getUserList(data: IUserRequest) {
  return api.get<ICommonResponse<ICommonPageResponse<IUser>>>({
    url: '/system/user/list',
    params: data
  })
}

// 新增用户
export function saveUser(data: IUserForm) {
  return api.post<ICommonResponse>({
    url: '/system/user',
    data
  })
}

// 查询用户
export function getUser(id: number) {
  return api.get<ICommonResponse<IUser>>({
    url: `/system/user/${id}`
  })
}

// 编辑用户
export function updateUser(data: IUserForm) {
  return api.put<ICommonResponse>({
    url: `/system/user`,
    data
  })
}

// 删除用户
export function deleteUser(ids: number[]) {
  return api.delete<ICommonResponse>({
    url: `/system/user/${ids}`
  })
}
