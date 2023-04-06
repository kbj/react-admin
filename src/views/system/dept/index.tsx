import type { FC, Key, PropsWithChildren } from 'react'
import React, { memo, useEffect, useState } from 'react'
import type { IDeptForm, IDeptList, IDeptSearch } from '@/api/types/system/dept'
import type { TableSearchFormItem } from '@/components/table-search-form/types'
import { FormItemType } from '@/components/table-search-form/types'
import { useDict, useModal } from '@/hooks'
import TableSearchForm from '@/components/table-search-form'
import { useNoPage } from '@/hooks/use-no-page'
import { addDept, deleteDept, getDept, listDept, updateDept } from '@/api/system/dept'
import type { ColumnsType } from 'antd/es/table'
import DictTag from '@/components/dict-tag'
import { buildTree, parseTimeStamp } from '@/utils'
import CommonTable from '@/components/common-table'
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Space, TreeSelect } from 'antd'
import { ClusterOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

const Dept: FC<PropsWithChildren> = () => {
  const [commonStatus, commonStatusSelect] = useDict('sys_common_status')
  const { data, init, loading, query, searchForm, setInit } = useNoPage<IDeptSearch, IDeptList>(listDept)
  const { confirmLoading, deleteConfirm, open, setConfirmLoading, setOpen, setTitle, title } = useModal()
  const [dataTree, setDataTree] = useState<IDeptList[]>([])

  useEffect(() => {
    if (!init) {
      searchForm.submit()
      setInit(true)
    }
  }, [])

  // 弹窗
  const [form] = Form.useForm<IDeptForm>()
  // 展开树的Key
  const [expandKeys, setExpandKeys] = useState<readonly Key[]>([])
  // 是否展开全部
  const [expandAll, setExpandAll] = useState<boolean>(true)
  // 构造树结构数据
  useEffect(() => {
    // 检查是否默认展开
    if (expandAll) {
      setExpandKeys(data.map((item) => item.id))
    } else {
      expandKeys.length > 0 && setExpandKeys([])
    }

    // 构造树结构
    setDataTree(buildTree(data))
  }, [data])

  // 新增按钮
  const handleClickAdd = (parentId?: number) => {
    listDept({ enabled: '1' }).then((response) => {
      form.resetFields()
      parentId && form.setFieldValue('parentId', parentId)
      setTitle('新增部门')
      setOpen(true)
    })
  }
  // 展开/折叠按钮
  const handleClickExpand = () => {
    const newValue = !expandAll
    if (newValue) {
      setExpandKeys(data.map((item) => item.id))
    } else {
      expandKeys.length > 0 && setExpandKeys([])
    }
    setExpandAll(newValue)
  }
  // 编辑按钮
  const handleClickEdit = (id: number) => {
    form.resetFields()
    getDept(id).then((resp) => {
      setTitle('编辑部门')
      form.setFieldsValue(resp.data)
      setOpen(true)
    })
  }
  // 删除按钮
  const handleClickDelete = (id: number) => {
    deleteConfirm(() => {
      deleteDept([id]).then(() => {
        message.success('删除成功')
        searchForm.submit()
      })
    })
  }
  // 保存
  const submit = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true)
      // 新增/编辑
      const action = values.id ? updateDept : addDept
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

  // 搜索表单配置
  const queryConfig: TableSearchFormItem[] = [
    {
      itemType: FormItemType.Input,
      label: '部门名称',
      fieldName: 'deptName'
    },
    {
      itemType: FormItemType.Select,
      label: '状态',
      fieldName: 'enabled',
      list: commonStatusSelect
    }
  ]

  // table表格配置
  const tableConfig: ColumnsType<IDeptList> = [
    { title: '部门名称', dataIndex: 'deptName', align: 'center' },
    { title: '排序', dataIndex: 'orderNum', align: 'center', width: '15%' },
    {
      title: '状态',
      dataIndex: 'enabled',
      align: 'center',
      width: '15%',
      render: (text) => <DictTag data={text} list={commonStatus} />
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      align: 'center',
      width: '20%',
      render: (text) => parseTimeStamp(text)
    },
    {
      title: '操作',
      align: 'center',
      width: '30%',
      render: (value, record) => {
        return (
          <>
            <Button size="small" type="link" onClick={() => handleClickEdit(record.id)} icon={<EditOutlined />}>
              编辑
            </Button>
            <Button size="small" type="link" onClick={() => handleClickAdd(record.id)} icon={<PlusOutlined />}>
              新增
            </Button>
            {record.parentId > 0 && (
              <Button
                size="small"
                type="link"
                onClick={() => handleClickDelete(record.id)}
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            )}
          </>
        )
      }
    }
  ]

  // 工具栏按钮
  const topTool = (
    <Space wrap>
      <Button type="primary" onClick={() => handleClickAdd()} icon={<PlusOutlined />}>
        新增
      </Button>
      <Button type="dashed" onClick={handleClickExpand} icon={<ClusterOutlined />}>
        展开/折叠
      </Button>
    </Space>
  )
  // 弹窗
  const dialog = (
    <Form
      name="form"
      form={form}
      autoComplete="off"
      initialValues={{ enabled: '1', orderNum: 0 }}
      labelCol={{ span: 4 }}
    >
      <Form.Item label="主键" hidden name="id">
        <InputNumber />
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue('parentId') === 0 || (
            <Form.Item label="上级部门" name="parentId" rules={[{ required: true, message: '请选择上级部门' }]}>
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                fieldNames={{ label: 'deptName', value: 'id' }}
                dropdownStyle={{ overflow: 'auto' }}
                placeholder="选择上级部门"
                treeDefaultExpandAll
                treeData={dataTree}
              />
            </Form.Item>
          )
        }
      </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item
            label="部门名称"
            name="deptName"
            labelCol={{ span: 8 }}
            rules={[
              { required: true, message: '部门名称不能为空' },
              { max: 100, message: '部门名称不能超过100个字符' }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="显示排序"
            labelCol={{ span: 8 }}
            name="orderNum"
            rules={[{ required: true, message: '显示排序不能为空' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="状态" name="enabled">
        <Select options={commonStatusSelect} />
      </Form.Item>
    </Form>
  )

  return (
    <>
      <TableSearchForm form={searchForm} config={queryConfig} loading={loading} query={query} />
      <CommonTable
        loading={loading}
        columns={tableConfig}
        data={dataTree}
        expandedRowKeys={expandKeys}
        onExpandedRowsChange={(keys) => setExpandKeys(keys)}
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

export default memo(Dept)
