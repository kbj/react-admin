import type { FC, Key, PropsWithChildren } from 'react'
import React, { memo, useEffect, useState } from 'react'
import { useDict, useModal } from '@/hooks'
import { useNoPage } from '@/hooks/use-no-page'
import { addMenu, deleteMenu, getMenu, listMenu, updateMenu } from '@/api/system/menu'
import type { IMenuForm, IMenuList, IMenuSearch } from '@/api/types/system/menu'
import { FormItemType, TableSearchFormItem } from '@/components/table-search-form/types'
import type { ColumnsType } from 'antd/es/table'
import { buildTree, iconToElement, parseTimeStamp } from '@/utils'
import DictTag from '@/components/dict-tag'
import { Button, Col, Form, Input, InputNumber, message, Modal, Radio, Row, Space, Switch, TreeSelect } from 'antd'
import TableSearchForm from '@/components/table-search-form'
import CommonTable from '@/components/common-table'
import { ClusterOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

/**
 * 菜单管理
 */
const Menu: FC<PropsWithChildren> = () => {
  const [commonStatus, commonStatusSelect] = useDict('sys_common_status')
  // 弹窗相关Hooks封装
  const { confirmLoading, deleteConfirm, open, setConfirmLoading, setOpen, setTitle, title } = useModal()
  const { data, init, loading, query, searchForm, setInit } = useNoPage<IMenuSearch, IMenuList>(listMenu)
  // 列表解析成树结构
  const [treeData, setTreeData] = useState<IMenuList[]>([])
  // 展开树的Key
  const [expandKeys, setExpandKeys] = useState<readonly Key[]>([])
  // 是否展开全部
  const [expandAll, setExpandAll] = useState<boolean>(false)

  /**
   * 初始化
   */
  useEffect(() => {
    if (!init) {
      searchForm.submit()
      setInit(true)
    }
  }, [])

  /**
   * 构造树结构数据
   */
  useEffect(() => {
    // 检查是否默认展开
    expandAll && setExpandKeys(data.map((item) => item.id))
    expandAll || (expandKeys.length > 0 && setExpandKeys([]))
    // 构造树结构
    setTreeData(buildTree(data))
  }, [data])

  /**
   * 新增按钮点击事件
   * @param parentId  父ID
   */
  const handleClickAdd = (parentId?: number) => {
    form.resetFields()
    parentId && form.setFieldValue('parentId', parentId)
    setTitle('新增菜单')
    setOpen(true)
  }

  /**
   * 展开/隐藏按钮点击事件
   */
  const handleClickExpand = () => {
    const newValue = !expandAll
    newValue && setExpandKeys(data.map((item) => item.id))
    newValue || (expandKeys.length > 0 && setExpandKeys([]))
    setExpandAll(newValue)
  }

  /**
   * 编辑点击事件
   */
  const handleClickEdit = (id: number) => {
    form.resetFields()
    getMenu(id).then((resp) => {
      // 父ID为0时候置空
      if (resp.data.parentId === 0) {
        resp.data.parentId = undefined
      }
      setTitle('编辑菜单')
      form.setFieldsValue(resp.data)
      setOpen(true)
    })
  }

  /**
   * 删除点击事件
   */
  const handleClickDelete = (id: number) => {
    deleteConfirm(() => {
      deleteMenu([id]).then(() => {
        message.success('删除成功')
        searchForm.submit()
      })
    })
  }

  // 弹窗
  const [form] = Form.useForm<IMenuForm>()
  const dialog = (
    <Form
      name="form"
      form={form}
      autoComplete="off"
      initialValues={{ enabled: '1', orderNum: 0, menuType: 'C', isCache: true, visible: true }}
      labelCol={{ span: 4 }}
    >
      <Form.Item label="主键" hidden name="id">
        <InputNumber />
      </Form.Item>
      <Form.Item label="上级菜单" name="parentId">
        <TreeSelect
          showSearch
          allowClear
          style={{ width: '100%' }}
          fieldNames={{ label: 'menuName', value: 'id' }}
          dropdownStyle={{ overflow: 'auto' }}
          placeholder="选择上级菜单"
          treeData={treeData}
        />
      </Form.Item>
      <Form.Item label="菜单类型" name="menuType">
        <Radio.Group>
          <Radio value="C" key="C">
            目录
          </Radio>
          <Radio value="M" key="M">
            菜单
          </Radio>
          <Radio value="B" key="B">
            按钮
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue('menuType') === 'B' || (
            <Form.Item label="菜单图标" name="icon">
              <Input />
            </Form.Item>
          )
        }
      </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item
            label="菜单名称"
            labelCol={{ span: 8 }}
            name="menuName"
            rules={[
              { required: true, message: '菜单名称不能为空' },
              { max: 100, message: '菜单名称不能超过100个字符' }
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
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue('menuType') === 'B' || (
            <Row>
              <Col span={12}>
                <Form.Item
                  label="是否外链"
                  name="isFrame"
                  labelCol={{ span: 8 }}
                  valuePropName="checked"
                  tooltip="选择是外链则路由地址需要以`http(s)://`开头"
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="路由地址"
                  name="path"
                  labelCol={{ span: 8 }}
                  rules={[
                    { required: true, message: '路由地址不能为空' },
                    { max: 200, message: '路由地址不能超过200个字符' }
                  ]}
                  tooltip="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          )
        }
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => (
          <Row>
            {getFieldValue('menuType') === 'M' && (
              // 只有菜单类型才显示
              <Col span={12}>
                <Form.Item
                  label="组件路径"
                  name="component"
                  labelCol={{ span: 8 }}
                  rules={[{ max: 200, message: '组件路径不能超过200个字符' }]}
                  tooltip="访问的组件路径，如：`/system/user`，默认在`views`目录下"
                >
                  <Input />
                </Form.Item>
              </Col>
            )}
            {getFieldValue('menuType') !== 'C' && (
              // 非目录类型显示
              <Col span={12}>
                <Form.Item
                  label="权限字符"
                  name="permissionFlag"
                  labelCol={{ span: 8 }}
                  rules={[{ max: 100, message: '权限字符不能超过100个字符' }]}
                  tooltip="控制器中定义的权限字符"
                >
                  <Input />
                </Form.Item>
              </Col>
            )}
          </Row>
        )}
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue('menuType') === 'M' && (
            <Row>
              <Col span={12}>
                <Form.Item
                  label="路由参数"
                  name="query"
                  labelCol={{ span: 8 }}
                  rules={[{ max: 200, message: '路由参数不能超过200个字符' }]}
                  tooltip={'访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="是否缓存"
                  name="isCache"
                  labelCol={{ span: 8 }}
                  valuePropName="checked"
                  tooltip="选择是则会被`keep-alive`缓存"
                >
                  <Switch checkedChildren="缓存" unCheckedChildren="不缓存" defaultChecked />
                </Form.Item>
              </Col>
            </Row>
          )
        }
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue('menuType') !== 'B' && (
            <Row>
              <Col span={12}>
                <Form.Item
                  label="显示状态"
                  name="visible"
                  labelCol={{ span: 8 }}
                  valuePropName="checked"
                  tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                >
                  <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="菜单状态"
                  name="enabled"
                  labelCol={{ span: 8 }}
                  tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                >
                  <Radio.Group>
                    {commonStatus.map((item) => (
                      <Radio value={item.dictValue} key={item.dictValue}>
                        {item.dictLabel}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          )
        }
      </Form.Item>
    </Form>
  )

  /**
   * 弹窗确认点击事件
   */
  const submit = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true)
      // 新增/编辑
      const action = values.id ? updateMenu : addMenu
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
      label: '菜单名称',
      fieldName: 'menuName'
    },
    {
      itemType: FormItemType.Select,
      label: '状态',
      fieldName: 'enabled',
      list: commonStatusSelect
    }
  ]
  // table表格配置
  const tableConfig: ColumnsType<IMenuList> = [
    { title: '菜单名称', dataIndex: 'menuName', align: 'center' },
    {
      title: '图标',
      dataIndex: 'icon',
      align: 'center',
      width: '10%',
      render: (value) => value && iconToElement(value)
    },
    { title: '排序', dataIndex: 'orderNum', align: 'center', width: '8%' },
    { title: '权限标识', dataIndex: 'permissionFlag', align: 'center', width: '13%' },
    { title: '组件地址', dataIndex: 'component', align: 'center', width: '13%' },
    {
      title: '状态',
      dataIndex: 'enabled',
      align: 'center',
      width: '5%',
      render: (text) => <DictTag data={text} list={commonStatus} />
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      align: 'center',
      width: '10%',
      render: (text) => parseTimeStamp(text)
    },
    {
      title: '操作',
      align: 'center',
      width: '15%',
      render: (value, record) => {
        return (
          <Space>
            <Button size="small" type="link" onClick={() => handleClickEdit(record.id)} icon={<EditOutlined />}>
              编辑
            </Button>
            <Button size="small" type="link" onClick={() => handleClickAdd(record.id)} icon={<PlusOutlined />}>
              新增
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
          </Space>
        )
      }
    }
  ]
  // 工具栏
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
  return (
    <>
      <TableSearchForm form={searchForm} config={queryConfig} loading={loading} query={query} />

      <CommonTable
        loading={loading}
        columns={tableConfig}
        data={treeData}
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
        width={800}
        forceRender
      >
        {dialog}
      </Modal>
    </>
  )
}

export default memo(Menu)
