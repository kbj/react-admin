// 列表
import type { IMenuForm, IMenuList, IMenuSearch } from '@/api/types/system/menu'
import api from '@/api'
import type { ICommonResponse } from '@/api/types/common'

// 列表
export function listMenu(params: IMenuSearch) {
  return api.get<ICommonResponse<IMenuList[]>>({
    url: '/system/menu/list',
    params
  })
}

// 详情
export function getMenu(id: number) {
  return api.get<ICommonResponse<IMenuForm>>({
    url: `/system/menu/${id}`
  })
}

// 新增
export function addMenu(data: IMenuForm) {
  return api.post<ICommonResponse>({
    url: '/system/menu',
    data
  })
}

// 编辑
export function updateMenu(data: IMenuForm) {
  return api.put<ICommonResponse>({
    url: '/system/menu',
    data
  })
}

// 删除
export function deleteMenu(ids: number[]) {
  return api.delete<ICommonResponse>({
    url: `/system/menu/${ids}`
  })
}
