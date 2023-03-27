import type {
  IDictData,
  IDictDataForm,
  IDictDataSearch,
  IDictForm,
  IDictList,
  IDictSearch
} from '@/api/types/system/dict'
import type { ICommonPageResponse, ICommonResponse } from '@/api/types/common'
import api from '@/api'

// 字典列表
export function listDict(params: IDictSearch) {
  return api.get<ICommonResponse<ICommonPageResponse<IDictList>>>({
    url: '/system/dict/list',
    params
  })
}

// 字典详情
export function getDict(id: number) {
  return api.get<ICommonResponse<IDictForm>>({
    url: `/system/dict/${id}`
  })
}

// 新增字典
export function addDict(data: IDictForm) {
  return api.post<ICommonResponse>({
    url: '/system/dict',
    data
  })
}

// 编辑字典
export function updateDict(data: IDictForm) {
  return api.put<ICommonResponse>({
    url: '/system/dict',
    data
  })
}

// 删除字典
export function deleteDict(ids: number[]) {
  return api.delete<ICommonResponse>({
    url: `/system/dict/${ids}`
  })
}

// 字典值列表
export function listDictData(params: IDictDataSearch) {
  return api.get<ICommonResponse<ICommonPageResponse<IDictData>>>({
    url: '/system/dict/data/list',
    params
  })
}

// 查询字典值
export function getDictData(id: number) {
  return api.get<ICommonResponse<IDictDataForm>>({
    url: `/system/dict/data/${id}`
  })
}

// 删除字典值
export function deleteDictData(ids: number[]) {
  return api.delete<ICommonResponse>({
    url: `/system/dict/data/${ids}`
  })
}

// 保存字典值
export function addDictData(data: IDictDataForm) {
  return api.post<ICommonResponse>({
    url: '/system/dict/data',
    data
  })
}

// 修改字典值
export function updateDictData(data: IDictDataForm) {
  return api.put<ICommonResponse>({
    url: '/system/dict/data',
    data
  })
}
