import type { FC, PropsWithChildren } from 'react'
import React, { memo } from 'react'
import { IDictData } from '@/api/types/system/dict'
import { Tag } from 'antd'

interface IProps extends PropsWithChildren {
  // 字典列表
  list: IDictData[]
  // 字典值
  data: string
}
const DictTag: FC<IProps> = (props) => {
  const dicts = props.list.filter((dict) => dict.dictValue === props.data)
  const dict = dicts && dicts.length > 0 ? dicts[0] : null

  return <>{dict ? dict.tagType ? <Tag color={dict.tagType}>{dict.dictLabel}</Tag> : dict.dictLabel : ''}</>
}

export default memo(DictTag)
