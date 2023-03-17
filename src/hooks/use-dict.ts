import { useState } from 'react'
import type { IDictData } from '@/api/types/system/dict'
import { useRequest } from 'ahooks'
import { DictTypeList } from '@/api/common'

/**
 * 业务字典Hooks
 */
export function useDict(dictType: string) {
  // 字典值列表
  const [dict, setDict] = useState<IDictData[]>([])
  useRequest(DictTypeList, {
    defaultParams: [dictType],
    onSuccess: (data) => {
      setDict(data.data)
    }
  })
  return dict
}
