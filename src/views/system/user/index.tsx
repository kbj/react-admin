import type { FC, ReactNode } from 'react'
import React, { memo, useEffect, useState } from 'react'
import TableSearchForm from '@/components/table-search-form'
import { getUserList } from '@/api/system/user'
import { useDict, usePage } from '@/hooks'
import type { IUser } from '@/api/types/common'
import type { IUserRequest } from '@/api/types/system/user'
import CommonTable from '@/components/common-table'
import type { TableSearchFormItem } from '@/components/table-search-form/types'
import { FormItemType } from '@/components/table-search-form/types'
import type { ColumnsType } from 'antd/es/table'
import DictTag from '@/components/dict-tag'
import { parseTimeStamp } from '@/utils/date'
import { Button, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

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
  // 初始化
  const [needInit, setNeedInit] = useState<boolean>(true)
  // 表单请求结构
  const { searchForm, query, pageChange, data, loading } = usePage<IUserRequest, IUser>(getUserList)
  // 字典
  const sysGender = useDict('sys_gender')

  useEffect(() => {
    if (needInit) {
      searchForm.submit()
      setNeedInit(false)
    }
  }, [])

  // 工具栏按钮
  const topTool = (
    <Space wrap>
      <Button type="primary" icon={<PlusOutlined />}>
        新增
      </Button>
      <Button icon={<EditOutlined />}>编辑</Button>
      <Button danger icon={<DeleteOutlined />}>
        删除
      </Button>
    </Space>
  )

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
        return (
          <>
            <Button size="small" type="link" icon={<EditOutlined />}>
              编辑
            </Button>
            <Button size="small" type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <>
      <TableSearchForm form={searchForm} config={queryConfig} loading={loading} query={query} />

      <CommonTable loading={loading} columns={tableConfig} rowKey={'id'} data={data} pageChange={pageChange}>
        {topTool}
      </CommonTable>
    </>
  )
}

export default memo(User)
