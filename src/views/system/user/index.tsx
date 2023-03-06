import type { FC, ReactNode } from 'react'
import React, { memo, useEffect } from 'react'
import TableSearchForm from '@/components/table-search-form'
import { useRequest } from 'ahooks'
import { getUserList } from '@/api/system/user'
import { usePage } from '@/hooks/use-page'
import { Table, theme } from 'antd'
import type { IUser } from '@/api/types/common'
import { searchConfig, tableConfig } from './config'

/**
 * 用户管理
 */
interface IProps {
  children?: ReactNode
}
const User: FC<IProps> = () => {
  const { pageNum, setPageNum, pageSize, setPageSize, data, setData } = usePage<IUser>()
  const { token } = theme.useToken()
  const { loading, run } = useRequest(getUserList, {
    manual: true,
    onSuccess: (resp, params) => {
      setPageNum(resp.data.pageNum)
      setPageSize(resp.data.pageSize)
      setData(resp.data.records)
    }
  })
  useEffect(() => {
    submit({})
  }, [])

  // 表单样式
  const contentStyle = {
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    padding: `2.4rem`,
    marginTop: '2rem'
  }

  /** 请求列表方法 **/
  const submit = (formData: any) => run({ ...formData, pageNum, pageSize })

  return (
    <>
      <TableSearchForm config={searchConfig} loading={loading} submit={submit} />

      <div style={contentStyle}>
        <Table rowKey="id" rowSelection={{ fixed: 'left' }} columns={tableConfig} dataSource={data} />
      </div>
    </>
  )
}

export default memo(User)
