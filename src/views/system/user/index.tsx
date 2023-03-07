import type { FC, ReactNode } from 'react'
import React, { memo, useEffect } from 'react'
import TableSearchForm from '@/components/table-search-form'
import { getUserList } from '@/api/system/user'
import { usePage } from '@/hooks/use-page'
import { Table, theme } from 'antd'
import type { IUser } from '@/api/types/common'
import { searchConfig, tableConfig } from './config'
import type { IUserRequest } from '@/api/types/system/user'

/**
 * 用户管理
 */
interface IProps {
  children?: ReactNode
}
const User: FC<IProps> = () => {
  useEffect(() => {
    submit({})
  }, [])

  // 表单请求结构
  const { pageNum, pageSize, data, loading, run } = usePage<IUser>(getUserList)
  // 主题颜色
  const { token } = theme.useToken()
  // 表单样式
  const contentStyle = {
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    padding: `2.4rem`,
    marginTop: '2rem'
  }

  /** 请求列表方法 **/
  const submit = (formData: IUserRequest) => run({ ...formData, pageNum, pageSize })

  return (
    <>
      <TableSearchForm<IUserRequest> config={searchConfig} loading={loading} submit={submit} />

      <div style={contentStyle}>
        <Table rowKey="id" loading={loading} rowSelection={{ fixed: 'left' }} columns={tableConfig} dataSource={data} />
      </div>
    </>
  )
}

export default memo(User)
