import type { FC, PropsWithChildren } from 'react'
import React, { memo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDict, useModal, usePage } from '@/hooks'
import type { IDictData, IDictDataForm, IDictDataSearch } from '@/api/types/system/dict'
import { addDictData, deleteDictData, getDictData, listDictData, updateDictData } from '@/api/system/dict'
import { Button, Form, Input, InputNumber, message, Modal, Radio, Select, Space } from 'antd'
import TableSearchForm from '@/components/table-search-form'
import { FormItemType, TableSearchFormItem } from '@/components/table-search-form/types'
import { ColumnsType } from 'antd/es/table'
import DictTag from '@/components/dict-tag'
import { parseTimeStamp } from '@/utils/date'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import CommonTable from '@/components/common-table'

/**
 * 字典值
 */
const DictData: FC<PropsWithChildren> = () => {
  const { dictType } = useParams()
  const [commonStatus, commonStatusSelect] = useDict('sys_common_status')
  const [, tagTypeSelect] = useDict('sys_tag_type')
  const { data, init, loading, pageChange, query, searchForm, selectedRowKeys, setInit, setSelectedRowKeys } = usePage<
    IDictDataSearch,
    IDictData
  >(listDictData, { dictType, orderBy: 'dict_sort' })
  const { confirmLoading, deleteConfirm, open, setConfirmLoading, setOpen, setTitle, title } = useModal()

  useEffect(() => {
    if (!init) {
      setInit(true)
      searchForm.submit()
    }
  }, [])

  // 弹窗
  const [form] = Form.useForm<IDictDataForm>()

  // 新增按钮
  const handleClickAdd = () => {
    form.resetFields()
    setTitle('新增字典数据')
    setOpen(true)
  }
  // 编辑按钮
  const handleClickEdit = (id?: number) => {
    form.resetFields()
    getDictData(id || (selectedRowKeys[0] as number)).then((resp) => {
      setTitle('编辑字典数据')
      form.setFieldsValue(resp.data)
      setOpen(true)
    })
  }
  // 删除按钮
  const handleClickDelete = (id?: number) => {
    deleteConfirm(() => {
      deleteDictData(id ? [id] : (selectedRowKeys as number[])).then(() => {
        message.success('删除成功')
        searchForm.submit()
      })
    })
  }
  // 取消按钮
  const handleCancel = () => {
    setConfirmLoading(false)
    setOpen(false)
  }

  // 保存
  const submit = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true)
      // 新增/编辑
      const action = values.id ? updateDictData : addDictData
      action(values)
        .then(() => {
          message.success('保存成功')
          setOpen(false)
          searchForm.submit()
        })
        .finally(() => setConfirmLoading(false))
    })
  }

  // 搜索表单配置
  const queryConfig: TableSearchFormItem[] = [
    {
      itemType: FormItemType.Input,
      label: '字典标签',
      fieldName: 'dictLabel'
    }
  ]

  // table表格配置
  const tableConfig: ColumnsType<IDictData> = [
    { title: '序号', align: 'center', render: (text, record, index) => `${index + 1}` },
    { title: '字典标签', dataIndex: 'dictLabel', align: 'center' },
    { title: '字典键值', dataIndex: 'dictValue', align: 'center' },
    { title: '字典排序', dataIndex: 'dictSort', align: 'center' },
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
    <Form
      name="form"
      form={form}
      autoComplete="off"
      initialValues={{ dictSort: 1, dictType, enabled: '1' }}
      labelCol={{ span: 4 }}
    >
      <Form.Item label="主键" hidden name="id">
        <InputNumber />
      </Form.Item>
      <Form.Item label="字典类型" name="dictType">
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="字典标签"
        name="dictLabel"
        rules={[{ required: true, max: 100, message: '字典标签长度不能超过100' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="字典键值"
        name="dictValue"
        rules={[{ required: true, max: 100, message: '字典键值长度不能超过100' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="排序" name="dictSort" rules={[{ required: true, message: '请输入排序' }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="标签类型" name="tagType">
        <Select options={tagTypeSelect} allowClear />
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

export default memo(DictData)
