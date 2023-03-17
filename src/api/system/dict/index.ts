import type { IDictData, IDictList, IDictSearch } from '@/api/types/system/dict'
import type { ICommonPageResponse, ICommonResponse, IPageRequest } from '@/api/types/common'
import api from '@/api'

// 字典列表
export function listDict(params: IDictSearch & IPageRequest) {
  return api.get<ICommonResponse<ICommonPageResponse<IDictList>>>({
    url: '/system/dict/list',
    params
  })
}

// 字典值列表
export function listDictData(params: IDictData & IPageRequest) {
  return api.get<ICommonResponse<ICommonPageResponse<IDictData>>>({
    url: '/system/dict/data/list',
    params
  })
}
