import type { FC, PropsWithChildren } from 'react'
import React, { memo, useEffect } from 'react'
import { FormItemType, TableSearchFormItem } from '@/components/table-search-form/types'
import { useDict, useModal, usePage } from '@/hooks'
import type { IDictForm, IDictList, IDictSearch } from '@/api/types/system/dict'
import { addDict, deleteDict, getDict, listDict, updateDict } from '@/api/system/dict'
import TableSearchForm from '@/components/table-search-form'
import type { ColumnsType } from 'antd/es/table'
import { NavLink } from 'react-router-dom'
import { parseTimeStamp } from '@/utils/date'
import CommonTable from '@/components/common-table'
import { Button, Form, Input, InputNumber, message, Modal, Radio, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import DictTag from '@/components/dict-tag'

/**
 * 字典管理
 */
const Dict: FC<PropsWithChildren> = () => {
  const { init, setInit, searchForm, query, pageChange, data, loading, selectedRowKeys, setSelectedRowKeys } = usePage<
    IDictSearch,
    IDictList
  >(listDict)
  const { confirmLoading, deleteConfirm, open, setConfirmLoading, setOpen, setTitle, title } = useModal()

  useEffect(() => {
    if (!init) {
      searchForm.submit()
      setInit(true)
    }
  }, [])
  const [commonStatus, commonStatusSelect] = useDict('sys_common_status')
  // 弹窗
  const [form] = Form.useForm<IDictForm>()

  // 新增按钮
  const handleClickAdd = () => {
    form.resetFields()
    setTitle('新增字典')
    setOpen(true)
  }
  // 编辑按钮
  const handleClickEdit = (id?: number) => {
    form.resetFields()
    getDict(id || (selectedRowKeys[0] as number)).then((resp) => {
      setTitle('编辑字典')
      form.setFieldsValue(resp.data)
      setOpen(true)
    })
  }
  // 删除按钮
  const handleClickDelete = (id?: number) => {
    deleteConfirm(() => {
      deleteDict(id ? [id] : (selectedRowKeys as number[])).then(() => {
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
      const action = values.id ? updateDict : addDict
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
      label: '字典名称',
      fieldName: 'dictName'
    },
    {
      itemType: FormItemType.Input,
      label: '字典类型',
      fieldName: 'dictType'
    },
    {
      itemType: FormItemType.Select,
      label: '状态',
      fieldName: 'enabled',
      list: commonStatusSelect
    }
  ]

  // table表格配置
  const tableConfig: ColumnsType<IDictList> = [
    { title: '序号', align: 'center', render: (text, record, index) => `${index + 1}` },
    { title: '字典名称', dataIndex: 'dictName', align: 'center' },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      align: 'center',
      render: (text) => <NavLink to={`/system/dict-data/${text}`}>{text}</NavLink>
    },
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
      render: (record, index) => {
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
    <Form name="form" form={form} autoComplete="off" initialValues={{ enabled: '1' }} labelCol={{ span: 4 }}>
      <Form.Item label="主键" hidden name="id">
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="字典名称"
        name="dictName"
        rules={[{ required: true, max: 100, message: '字典名称长度不能超过100' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="字典类型"
        name="dictType"
        rules={[{ required: true, max: 100, message: '字典类型长度不能超过100' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="状态" name="enabled">
        <Radio.Group>
          {commonStatus.map((item) => (
            <Radio value={item.dictValue}>{item.dictLabel}</Radio>
          ))}
        </Radio.Group>
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

export default memo(Dict)
