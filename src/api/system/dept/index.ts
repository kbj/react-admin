import type { IDeptForm, IDeptList, IDeptSearch } from '@/api/types/system/dept'
import api from '@/api'
import type { ICommonResponse } from '@/api/types/common'

// 列表
export function listDept(params: IDeptSearch) {
  return api.get<ICommonResponse<IDeptList[]>>({
    url: '/system/dept/list',
    params
  })
}

// 详情
export function getDept(id: number) {
  return api.get<ICommonResponse<IDeptForm>>({
    url: `/system/dept/${id}`
  })
}

// 新增
export function addDept(data: IDeptForm) {
  return api.post<ICommonResponse>({
    url: '/system/dept',
    data
  })
}

// 编辑
export function updateDept(data: IDeptForm) {
  return api.put<ICommonResponse>({
    url: '/system/dept',
    data
  })
}

// 删除
export function deleteDept(ids: number[]) {
  return api.delete<ICommonResponse>({
    url: `/system/dept/${ids}`
  })
}
