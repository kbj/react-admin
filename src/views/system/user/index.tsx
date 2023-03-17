import type { FC, ReactNode } from 'react'
import React, { memo, useEffect, useRef } from 'react'
import TableSearchForm from '@/components/table-search-form'
import { getUserList } from '@/api/system/user'
import { useDict, usePage } from '@/hooks'
import type { IUser } from '@/api/types/common'
import type { IUserRequest } from '@/api/types/system/user'
import CommonTable from '@/components/common-table'
import type { ITableSearchFormMethods, TableSearchFormItem } from '@/components/table-search-form/types'
import { FormItemType } from '@/components/table-search-form/types'
import type { ColumnsType } from 'antd/es/table'
import DictTag from '@/components/dict-tag'
import { parseTimeStamp } from '@/utils/date'
import { Button } from 'antd'

// 搜索表单配置
const queryConfig: TableSearchFormItem[] = [
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
 * 用户管理
 */
interface IProps {
  children?: ReactNode
}
const User: FC<IProps> = () => {
  const searchForm = useRef<ITableSearchFormMethods | null>(null)
  useEffect(() => {
    submit({})
  }, [])

  // 字典
  const sysGender = useDict('sys_gender')

  // 表单请求结构
  const { pageNum, setPageNum, pageSize, setPageSize, data, loading, run } = usePage<IUser>(getUserList)

  // 请求数据
  const submit = (formData: IUserRequest) => run({ ...formData, pageNum, pageSize })

  // 表格更新事件
  const handleTableChange = (page?: number, pageSize?: number) => {
    page && setPageNum(page)
    pageSize && setPageSize(pageSize)
    searchForm.current?.request()
  }

  // table表格配置
  const tableConfig: ColumnsType<IUser> = [
    { title: '用户名', dataIndex: 'username', align: 'center' },
    { title: '昵称', dataIndex: 'nickName', align: 'center' },
    { title: '手机号码', dataIndex: 'mobile', align: 'center' },
    {
      title: '性别',
      dataIndex: 'gender',
      align: 'center',
      render: (text) => <DictTag data={text} list={sysGender} />
    },
    { title: '创建时间', dataIndex: 'createAt', align: 'center', render: (text) => parseTimeStamp(text) },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (text, record, index) => {
        return <Button size="small">编辑</Button>
      }
    }
  ]

  return (
    <>
      <TableSearchForm ref={searchForm} config={queryConfig} loading={loading} submit={submit} />

      <CommonTable loading={loading} columns={tableConfig} rowKey={'id'} data={data} tableChange={handleTableChange} />
    </>
  )
}

export default memo(User)
