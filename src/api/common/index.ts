import api from '@/api'
import type { IDictData } from '@/api/types/system/dict'
import type { ICommonResponse } from '@/api/types/common'
import type { IRoleList } from '@/api/types/system/role'

/**
 * 通用字典查询
 * @param dictType 字典类型
 */
export function dictTypeList(dictType: string) {
  return api.get<ICommonResponse<IDictData[]>>({
    url: `/system/dict/data/type/${dictType}`
  })
}

/**
 * 角色列表信息
 */
export function rolesList() {
  return api.get<ICommonResponse<IRoleList[]>>({
    url: '/roles'
  })
}
