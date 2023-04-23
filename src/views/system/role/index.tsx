import type { FC, PropsWithChildren } from 'react'
import React, { memo, useEffect, useState } from 'react'
import { useDict, useModal, usePage } from '@/hooks'
import type { IRoleForm, IRoleList, IRoleSearch } from '@/api/types/system/role'
import { addRole, deleteRole, getRole, listRole, updateRole } from '@/api/system/role'
import type { TableSearchFormItem } from '@/components/table-search-form/types'
import { FormItemType } from '@/components/table-search-form/types'
import type { ColumnsType } from 'antd/es/table'
import DictTag from '@/components/dict-tag'
import { buildTree, parseTimeStamp } from '@/utils'
import { Button, Form, Input, InputNumber, message, Modal, Radio, Space, Tree } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import TableSearchForm from '@/components/table-search-form'
import CommonTable from '@/components/common-table'
import { listMenu } from '@/api/system/menu'
import { IMenuList } from '@/api/types/system/menu'

const Role: FC<PropsWithChildren> = () => {
  const [commonStatus, commonStatusSelect] = useDict('sys_common_status')
  const { confirmLoading, deleteConfirm, open, setConfirmLoading, setOpen, setTitle, title } = useModal()
  const { data, init, loading, pageChange, query, searchForm, selectedRowKeys, setInit, setSelectedRowKeys } = usePage<
    IRoleSearch,
    IRoleList
  >(listRole)
  const [menuList, setMenuList] = useState<IMenuList[]>([]) // 菜单列表

  /**
   * 初始化
   */
  useEffect(() => {
    if (!init) {
      // 查询表单
      searchForm.submit()
      // 查询菜单列表
      listMenu({ enabled: '1' }).then((response) => {
        setMenuList(buildTree(response.data))
      })
      setInit(true)
    }
  }, [])

  // 弹窗
  const [form] = Form.useForm<IRoleForm>()
  const dialog = (
    <Form
      name="form"
      form={form}
      autoComplete="off"
      initialValues={{ enabled: '1', checkStrictly: true }}
      labelCol={{ span: 4 }}
    >
      <Form.Item label="主键" hidden name="id">
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="角色名称"
        name="roleName"
        rules={[
          { required: true, message: '角色名称不能为空' },
          { max: 20, message: '菜单名称不能超过20个字符' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => (
          <Form.Item
            label="权限字符"
            name="roleKey"
            rules={[
              { required: true, message: '权限字符不能为空' },
              { max: 100, message: '菜单名称不能超过100个字符' }
            ]}
          >
            <Input disabled={!!getFieldValue('id')} />
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item label="角色顺序" name="orderNum" rules={[{ required: true, message: '角色顺序不能为空' }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="状态" name="enabled">
        <Radio.Group>
          {commonStatus.map((item) => (
            <Radio value={item.dictValue} key={item.dictValue}>
              {item.dictLabel}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="菜单权限"
        name="menus"
        colon={false}
        valuePropName="checkedKeys"
        trigger="onCheck"
        validateTrigger="onCheck"
      >
        <Tree
          checkable
          fieldNames={{ title: 'menuName', key: 'id' }}
          treeData={menuList}
          rootStyle={{ border: '1px solid #e5e6e7' }}
        />
      </Form.Item>
    </Form>
  )

  /**
   * 新增按钮点击事件
   */
  const handleClickAdd = () => {
    form.resetFields()
    setTitle('新增菜单')
    setOpen(true)
  }

  /**
   * 编辑点击事件
   */
  const handleClickEdit = (id?: number) => {
    form.resetFields()
    getRole(id || (selectedRowKeys[0] as number)).then((resp) => {
      setTitle('编辑角色')
      form.setFieldsValue(resp.data)
      setOpen(true)
    })
  }

  // 删除按钮点击
  const handleClickDelete = (id?: number) => {
    deleteConfirm(() => {
      deleteRole(id ? [id] : (selectedRowKeys as number[])).then(() => {
        message.success('删除成功')
        searchForm.submit()
      })
    })
  }

  /**
   * 弹窗确认点击事件
   */
  const submit = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true)
      // 新增/编辑
      const action = values.id ? updateRole : addRole
      action(values)
        .then(() => {
          message.success('保存成功')
          setOpen(false)
          searchForm.submit()
        })
        .finally(() => setConfirmLoading(false))
    })
  }

  /**
   * 取消弹窗逻辑
   */
  const handleCancel = () => {
    setConfirmLoading(false)
    setOpen(false)
  }

  // 搜索表单配置
  const queryConfig: TableSearchFormItem[] = [
    {
      itemType: FormItemType.Input,
      label: '角色名称',
      fieldName: 'roleName'
    },
    {
      itemType: FormItemType.Input,
      label: '权限字符',
      fieldName: 'roleKey'
    },
    {
      itemType: FormItemType.Select,
      label: '状态',
      fieldName: 'enabled',
      list: commonStatusSelect
    }
  ]
  // table表格配置
  const tableConfig: ColumnsType<IRoleList> = [
    { title: '序号', align: 'center', render: (text, record, index) => `${index + 1}` },
    { title: '角色名称', dataIndex: 'roleName', align: 'center' },
    { title: '权限字符', dataIndex: 'roleKey', align: 'center' },
    { title: '排序', dataIndex: 'orderNum', align: 'center' },
    {
      title: '状态',
      dataIndex: 'enabled',
      align: 'center',
      render: (text) => <DictTag data={text} list={commonStatus} />
    },
    { title: '创建时间', dataIndex: 'createAt', align: 'center', render: (text) => parseTimeStamp(text) },
    {
      title: '操作',
      align: 'center',
      width: '15%',
      render: (value, record) => (
        <Space>
          <Button size="small" type="link" onClick={() => handleClickEdit(record.id)} icon={<EditOutlined />}>
            编辑
          </Button>
          <Button
            size="small"
            type="link"
            danger
            onClick={() => handleClickDelete(record.id)}
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]
  // 工具栏
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

      <Modal
        title={title}
        confirmLoading={confirmLoading}
        open={open}
        onOk={submit}
        onCancel={handleCancel}
        bodyStyle={{ paddingTop: '1.2rem' }}
        width={600}
        forceRender
      >
        {dialog}
      </Modal>
    </>
  )
}

export default memo(Role)
