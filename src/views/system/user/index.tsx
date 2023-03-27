import type { FC, PropsWithChildren } from 'react'
import React, { memo, useEffect } from 'react'
import TableSearchForm from '@/components/table-search-form'
import { deleteUser, getUser, getUserList, saveUser, updateUser } from '@/api/system/user'
import { useDict, useModal, usePage } from '@/hooks'
import type { IUser } from '@/api/types/common'
import type { IUserForm, IUserRequest } from '@/api/types/system/user'
import CommonTable from '@/components/common-table'
import type { TableSearchFormItem } from '@/components/table-search-form/types'
import { FormItemType } from '@/components/table-search-form/types'
import type { ColumnsType } from 'antd/es/table'
import DictTag from '@/components/dict-tag'
import { parseTimeStamp } from '@/utils/date'
import { Button, Form, Input, InputNumber, message, Modal, Select, Space } from 'antd'
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
const User: FC<PropsWithChildren> = () => {
  // 表单请求结构
  const { init, setInit, searchForm, query, pageChange, data, loading, selectedRowKeys, setSelectedRowKeys } = usePage<
    IUserRequest,
    IUser
  >(getUserList)
  // 弹窗
  const { open, setOpen, setTitle, title, confirmLoading, setConfirmLoading, deleteConfirm } = useModal()
  // 字典
  const [sysGender, sysGenderSelect] = useDict('sys_gender')

  useEffect(() => {
    if (!init) {
      searchForm.submit()
      setInit(true)
    }
  }, [])

  // 弹窗
  const [form] = Form.useForm<IUserForm>()

  // 保存
  const submit = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true)
      // 新增/编辑
      const action = values.id ? updateUser : saveUser
      action(values)
        .then(() => {
          message.success('保存成功')
          setOpen(false)
          searchForm.submit()
        })
        .finally(() => setConfirmLoading(false))
    })
  }
  const handleCancel = () => {
    setConfirmLoading(false)
    setOpen(false)
  }

  // 新增按钮点击
  const handleClickAdd = () => {
    form.resetFields()
    setTitle('新增用户')
    setOpen(true)
  }
  // 编辑按钮点击
  const handleClickEdit = (id?: number) => {
    form.resetFields()
    getUser(id || (selectedRowKeys[0] as number)).then((resp) => {
      setTitle('编辑用户')
      form.setFieldsValue(resp.data)
      setOpen(true)
    })
  }
  // 删除按钮点击
  const handleClickDelete = (id?: number) => {
    deleteConfirm(() => {
      deleteUser(id ? [id] : (selectedRowKeys as number[])).then(() => {
        message.success('删除成功')
        searchForm.submit()
      })
    })
  }

  // table表格配置
  const tableConfig: ColumnsType<IUser> = [
    { title: '序号', align: 'center', render: (text, record, index) => `${index + 1}` },
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
            <Button size="small" type="link" onClick={() => handleClickEdit(record.id)} icon={<EditOutlined />}>
              编辑
            </Button>
            <Button
              size="small"
              type="link"
              onClick={() => handleClickDelete(record.id)}
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </>
        )
      }
    }
  ]

  // 工具栏按钮
  const topTool = (
    <Space wrap>
      <Button type="primary" onClick={handleClickAdd} icon={<PlusOutlined />}>
        新增
      </Button>
      <Button disabled={selectedRowKeys.length != 1} onClick={() => handleClickEdit()} icon={<EditOutlined />}>
        编辑
      </Button>
      <Button
        danger
        disabled={selectedRowKeys.length < 1}
        onClick={() => handleClickDelete()}
        icon={<DeleteOutlined />}
      >
        删除
      </Button>
    </Space>
  )

  // 弹窗
  const dialog = (
    <Form name="form" form={form} autoComplete="off" labelCol={{ span: 2 }}>
      <Form.Item label="主键" hidden name="id">
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, pattern: /^[a-zA-Z0-9]{5,16}$/, message: '用户名限制5-16位英文数字' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[
          ({ getFieldValue }) => ({
            required: !getFieldValue('id'),
            pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~\\.!@#$%^&*])[a-zA-Z\d~\\.!@#$%^&*]{8,32}$/,
            message: '密码长度8-32且必须存在特殊字符、英文、数字'
          })
        ]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      <Form.Item label="性别" name="gender" rules={[{ required: true, message: '请选择性别' }]}>
        <Select options={sysGenderSelect} allowClear />
      </Form.Item>
      <Form.Item label="昵称" name="nickName" rules={[{ required: false, max: 32, message: '昵称不能超过32个字' }]}>
        <Input placeholder="请输入昵称" />
      </Form.Item>
      {/*<Form.Item label="部门" name="deptId">*/}
      {/*  <Input placeholder="请输入部门" />*/}
      {/*</Form.Item>*/}
      <Form.Item
        label="手机号"
        name="mobile"
        rules={[{ required: false, pattern: /^1\d{10}$/, message: '请输入正确手机号' }]}
      >
        <Input placeholder="请输入手机号" />
      </Form.Item>
    </Form>
  )

  return (
    <>
      <TableSearchForm form={searchForm} config={queryConfig} loading={loading} query={query} />

      <CommonTable
        loading={loading}
        columns={tableConfig}
        data={data}
        pageChange={pageChange}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        {topTool}
      </CommonTable>

      {/*新增修改弹窗*/}
      <Modal
        title={title}
        confirmLoading={confirmLoading}
        open={open}
        onOk={submit}
        onCancel={handleCancel}
        width={800}
        bodyStyle={{ paddingTop: '1.2rem' }}
        forceRender
      >
        {dialog}
      </Modal>
    </>
  )
}

export default memo(User)
