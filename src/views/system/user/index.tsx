import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import TableSearchForm from '@/components/table-search-form'
import { searchFormConfig } from '@/views/system/user/config'
import { useRequest } from 'ahooks'
import { getUserList } from '@/api/system/user'
import { usePage } from '@/hooks/use-page'

/**
 * 用户管理
 */
interface IProps {
  children?: ReactNode
}
const User: FC<IProps> = () => {
  const { pageNum, setPageNum, pageSize, setPageSize, data, setData } =
    usePage()
  const { loading, run } = useRequest(getUserList, {
    manual: true,
    onSuccess: (resp, params) => {
      setPageNum(resp.data.pageNum)
      setPageSize(resp.data.pageSize)
      setData(resp.data.records)
    }
  })

  /**
   * 请求列表方法
   * @param formData  表单数据
   */
  const submit = (formData: any) => run({ ...formData, pageNum, pageSize })

  return (
    <>
      <TableSearchForm
        config={searchFormConfig}
        loading={loading}
        submit={submit}
      />

      <div>{data}</div>
    </>
  )
}

export default memo(User)
