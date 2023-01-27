import api from '@/api'
import { ICommonResponse, IMenuTreeList } from '@/global/types/common'

/**
 * 请求菜单树
 */
export function menuTreeList(roleId: number) {
  return api.get<ICommonResponse<IMenuTreeList[]>>({
    url: `/role/${roleId}/menu`
  })
}
