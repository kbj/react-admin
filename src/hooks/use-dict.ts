import type { Key } from 'react'
import { useState } from 'react'
import type { IDictData } from '@/api/types/system/dict'
import { useRequest } from 'ahooks'
import { DictTypeList } from '@/api/common'

/**
 * 业务字典Hooks
 */
export function useDict(dictType: string): [IDictData[], { value: Key; label: string }[]] {
  // 字典值列表
  const [dict, setDict] = useState<IDictData[]>([])
  // 给下拉使用列表
  const [dictSelect, setDictSelect] = useState<{ value: Key; label: string }[]>([])

  useRequest(DictTypeList, {
    defaultParams: [dictType],
    onSuccess: (data) => {
      setDict(data.data)
      data.data &&
        data.data.length > 0 &&
        setDictSelect(
          data.data
            .filter((item) => !!item.dictValue)
            .map((item) => ({ label: item.dictLabel || '', value: item.dictValue as Key }))
        )
    }
  })

  return [dict, dictSelect]
}
