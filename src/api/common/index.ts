import api from '@/api'
import { IDictData } from '@/api/types/system/dict'
import { ICommonResponse } from '@/api/types/common'

/**
 * 通用字典查询
 * @param dictType 字典类型
 */
export function DictTypeList(dictType: string) {
  return api.get<ICommonResponse<IDictData[]>>({
    url: `/system/dict/data/type/${dictType}`
  })
}
