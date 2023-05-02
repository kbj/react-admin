import type { FC, Key, PropsWithChildren } from 'react'
import React, { memo, useEffect, useState } from 'react'
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
import { buildTree, parseTimeStamp } from '@/utils'
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tree,
  TreeSelect
} from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { IDeptList } from '@/api/types/system/dept'
import { listDept } from '@/api/system/dept'
import { CommonStatus } from '@/global/enums'
import { rolesList } from '@/api/common'

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
  },
  {
    itemType: FormItemType.Input,
    label: '所属部门',
    fieldName: 'deptId',
    hidden: true
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
  const [commonStatus, commonStatusSelect] = useDict('sys_common_status')
  // 部门树列表
  const [dataTree, setDataTree] = useState<IDeptList[]>([])
  // 角色列表
  const [roleList, setRoleList] = useState<{ label: string; value: Key }[]>([])
  // 展开树的Key
  const [expandKeys, setExpandKeys] = useState<Key[]>([])
  // 选中的树节点
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])

  useEffect(() => {
    if (!init) {
      requestDeptTree()
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
    requestRoleList()

    form.resetFields()
    setTitle('新增用户')
    setOpen(true)
  }
  // 编辑按钮点击
  const handleClickEdit = (id?: number) => {
    requestRoleList()

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

  /**
   * 请求部门树
   */
  const requestDeptTree = () => {
    listDept({ enabled: CommonStatus.TRUE }).then((response) => {
      setDataTree(buildTree(response.data))

      // 默认为全部展开状态
      const defaultKeys = response.data.map((item) => item.id)
      setExpandKeys(defaultKeys)
    })
  }

  /**
   * 请求角色列表
   */
  const requestRoleList = () => {
    rolesList().then((response) => {
      setRoleList(response.data.map((item) => ({ label: item.roleName || '', value: item.id as Key })))
    })
  }

  /**
   * 左侧部门树点击事件
   */
  const deptTreeClick = (selectedKeys: Key[]) => {
    setSelectedKeys(selectedKeys)
    searchForm.setFieldValue('deptId', selectedKeys && selectedKeys.length > 0 ? selectedKeys[0] : undefined)
    searchForm.submit()
  }
  useEffect(() => {
    if (!searchForm.getFieldValue('deptId')) {
      setSelectedKeys([])
    }
  }, [searchForm.getFieldValue('deptId')])

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
    <Form
      name="form"
      form={form}
      autoComplete="off"
      initialValues={{ enabled: '1', deptId: selectedKeys && selectedKeys.length > 0 ? selectedKeys[0] : undefined }}
      labelCol={{ span: 4 }}
    >
      <Form.Item label="主键" hidden name="id">
        <InputNumber />
      </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, pattern: /^[a-zA-Z0-9]{5,16}$/, message: '用户名限制5-16位英文数字' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
        </Col>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <Form.Item label="性别" name="gender" rules={[{ required: true, message: '请选择性别' }]}>
            <Select options={sysGenderSelect} allowClear />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="昵称"
            name="nickName"
            rules={[
              { required: true, message: '请输入昵称' },
              { max: 32, message: '昵称不能超过32个字' }
            ]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="手机号"
            name="mobile"
            rules={[{ required: false, pattern: /^1\d{10}$/, message: '请输入正确手机号' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="邮箱" name="email" rules={[{ required: false, max: 200, message: '邮箱不能超过200字符' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="部门" name="deptId">
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              fieldNames={{ label: 'deptName', value: 'id' }}
              dropdownStyle={{ overflow: 'auto' }}
              placeholder="选择部门"
              treeDefaultExpandAll
              treeData={dataTree}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="状态" name="enabled">
            <Radio.Group>
              {commonStatus.map((item) => (
                <Radio value={item.dictValue} key={item.dictValue}>
                  {item.dictLabel}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="角色" name="roles" labelCol={{ span: 2 }}>
            <Select mode="multiple" options={roleList} allowClear style={{ width: '100%' }} placeholder="请选择角色" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  return (
    <>
      <Row gutter={20}>
        <Col span={4}>
          <div>
            <Input.Search style={{ marginBottom: 8 }} placeholder="请输入部门名称" />
            <Tree
              blockNode
              style={{ marginTop: '1rem' }}
              fieldNames={{ title: 'deptName', key: 'id' }}
              selectedKeys={selectedKeys}
              expandedKeys={expandKeys}
              onExpand={(expandKeys) => setExpandKeys(expandKeys)}
              onSelect={(selectedKeys) => deptTreeClick(selectedKeys)}
              treeData={dataTree as any[]}
            />
          </div>
        </Col>
        <Col span={20}>
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
        </Col>
      </Row>

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
