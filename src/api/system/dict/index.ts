import type { IDictList, IDictSearch } from '@/api/types/system/dict'
import type { ICommonPageResponse, ICommonResponse, IPageRequest } from '@/api/types/common'
import api from '@/api'

// 字典列表
export function listDict(params: IDictSearch & IPageRequest) {
  return api.get<ICommonResponse<ICommonPageResponse<IDictList>>>({
    url: '/system/dict/list',
    params
  })
}
