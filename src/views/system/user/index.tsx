import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import TableSearchForm from '@/components/table-search-form'
import { useRequest } from 'ahooks'
import { getUserList } from '@/api/system/user'
import { usePage } from '@/hooks/use-page'
import type { TableSearchFormItem } from '@/components/table-search-form/types'
import { FormItemType } from '@/components/table-search-form/types'
import type { ColumnsType } from 'antd/es/table'
import { Table, theme } from 'antd'
import type { IUser } from '@/api/types/common'

/**
 * 用户管理搜索表单配置
 */
const searchFormConfig: TableSearchFormItem[] = [
  {
    itemType: FormItemType.Input,
    label: '用户名',
    fieldName: 'username'
  },
  {
    itemType: FormItemType.Input,
    label: '手机号码',
    fieldName: 'mobile'
  },
  {
    itemType: FormItemType.Date,
    label: '创建时间',
    fieldName: 'createTime'
  }
]

/**
 * table表格配置
 */
const tableConfig: ColumnsType<IUser> = [
  { title: '用户名', dataIndex: 'username', align: 'center' },
  { title: '手机号码', dataIndex: 'mobile', align: 'center' },
  { title: '性别', dataIndex: 'gender', align: 'center' }
]

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

  // 表单样式
  const contentStyle = {
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    padding: `2.4rem`,
    marginTop: '2rem'
  }

  /**
   * 请求列表方法
   * @param formData  表单数据
   */
  const submit = (formData: any) => run({ ...formData, pageNum, pageSize })

  return (
    <>
      <TableSearchForm config={searchFormConfig} loading={loading} submit={submit} />

      <div style={contentStyle}>
        <Table rowKey="id" rowSelection={{ fixed: 'left' }} columns={tableConfig} dataSource={data} />
      </div>
    </>
  )
}

export default memo(User)
