// 列表
import type { IRoleForm, IRoleList, IRoleSearch } from '@/api/types/system/role'
import api from '@/api'
import type { ICommonPageResponse, ICommonResponse } from '@/api/types/common'

export function listRole(params: IRoleSearch) {
  return api.get<ICommonResponse<ICommonPageResponse<IRoleList>>>({
    url: '/system/role/list',
    params
  })
}

// 详情
export function getRole(id: number) {
  return api.get<ICommonResponse<IRoleForm>>({
    url: `/system/role/${id}`
  })
}

// 新增
export function addRole(data: IRoleForm) {
  return api.post<ICommonResponse>({
    url: `/system/role`,
    data
  })
}

// 编辑
export function updateRole(data: IRoleForm) {
  return api.put<ICommonResponse>({
    url: '/system/role',
    data
  })
}

// 删除
export function deleteRole(ids: number[]) {
  return api.delete<ICommonResponse>({
    url: `/system/role/${ids}`
  })
}
