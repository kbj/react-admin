import type { FC } from 'react'
import React, { memo, useLayoutEffect, useState } from 'react'
import type { MenuProps, TablePaginationConfig, TreeProps } from 'antd'
import { Button, Checkbox, Dropdown, Popover, Space, Table, theme, Tooltip, Tree } from 'antd'
import { ColumnHeightOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons'
import type { SizeType } from 'antd/es/config-provider/SizeContext'
import type { DataNode } from 'antd/es/tree'
import type { IProps } from './types'
import { ColumnsType } from 'antd/es/table'

/**
 * 项目用Table自封装
 */
const CommonTable: FC<IProps> = (props) => {
  // 初始化
  const [init, setInit] = useState<boolean>(false)
  useLayoutEffect(() => {
    !init && created()
  }, [])

  // 表单样式
  const { token } = theme.useToken()
  const contentStyle = {
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    padding: `2.4rem`,
    marginTop: '2rem'
  }
  // 表格大小
  const [tableSize, setTableSize] = useState<string>('large')
  // 初始化方法
  const created = () => {
    setInit(true)
    generateColumnSettingNode() // 初始化列数据
  }

  // 分页器设置
  const pageConfig: TablePaginationConfig = {
    position: ['bottomRight'],
    showQuickJumper: true, // 启用快速跳转
    current: props.data.pageNum, // 当前页
    pageSize: props.data.pageSize, // 每页大小
    total: props.data.total, // 总数
    hideOnSinglePage: false, // 只有一页时是否隐藏分页器
    showSizeChanger: true, // 显示页码切换器
    responsive: true, // 根据屏幕宽度自动调整尺寸
    showTotal: (total) => `共 ${total} 条`, // 显示总数
    onChange: props.tableChange // 分页器改变方法
  }

  /** 列设置 **/
  const [tableColumn, setTableColumn] = useState<ColumnsType<any>>(props.columns) // 实际影响到的列
  const [columnList, setColumnList] = useState<DataNode[]>([]) // 列设置拖动列表
  const [checkAll, setCheckAll] = useState<boolean>(true) // 是否展示所有列
  const [indeterminate, setIndeterminate] = useState<boolean>(false) // 是否半选
  useLayoutEffect(() => {
    // 重新生成tableColumn
    const newTableColumn: ColumnsType<any> = []
    columnList.map((column) => {
      const find = tableColumn.find((item) => (item as any).dataIndex === column.key || item.title === column.key)
      find && newTableColumn.push(find)
    })
    newTableColumn.length > 0 && setTableColumn(newTableColumn)
  }, [columnList])
  useLayoutEffect(() => {
    setTableColumn(props.columns)
  }, [props.columns])
  // 勾选选中的列事件
  const columnSettingOnChecked = (checkedKeysValue: React.Key[]) => {
    // 更新tableColumn
    const newTableColumn: ColumnsType<any> = []
    columnList
      .filter((column) => checkedKeysValue.indexOf(column.key) > -1)
      .map((column) => {
        const find = props.columns.find((item) => (item as any).dataIndex === column.key || item.title === column.key)
        find && newTableColumn.push(find)
      })
    newTableColumn.length != tableColumn.length && setTableColumn(newTableColumn as ColumnsType<any>)

    // 全选/半选/非全选状态更新
    setCheckAll(checkedKeysValue.length === columnList.length)
    setIndeterminate(checkedKeysValue.length > 0 && checkedKeysValue.length !== columnList.length)
  }
  // 勾选/取消勾选全部事件
  const columnSettingCheckAll = (checked: boolean) => {
    columnSettingOnChecked(checked ? columnList.map((item) => item.key) : [])
  }
  // 拖动事件
  const columnSettingOnDrop: TreeProps['onDrop'] = (dropInfo) => {
    const sourcePosition = parseInt(dropInfo.dragNode.pos.split('-')[1]) // 拖动组件原始索引位置
    const targetPosition = dropInfo.dropPosition > 0 ? dropInfo.dropPosition - 1 : dropInfo.dropPosition // 拖动组件目标索引位置

    // 实际table列数组位置与列设置list位置组合
    const data = tableColumn.slice(0, Math.min(sourcePosition, targetPosition > 0 ? targetPosition : 0))
    const columnData = columnList.slice(0, Math.min(sourcePosition, targetPosition > 0 ? targetPosition : 0))

    if (sourcePosition < targetPosition) {
      // 往下拖拽
      // 推入原始位置与目标位置之间的数据
      data.push(...tableColumn.slice(sourcePosition + 1, targetPosition + 1))
      columnData.push(...columnList.slice(sourcePosition + 1, targetPosition + 1))
      // 推入拖动的数据
      data.push(tableColumn[sourcePosition]) && columnData.push(columnList[sourcePosition])
      // 目标位置后的数据也推入
      if (targetPosition < tableColumn.length - 1) {
        data.push(...tableColumn.slice(targetPosition + 1))
        columnData.push(...columnList.slice(targetPosition + 1))
      }
    } else if (sourcePosition > targetPosition) {
      // 往上拖拽
      // 推入拖动组件
      targetPosition > 0 && data.push(tableColumn[targetPosition])
      data.push(tableColumn[sourcePosition])
      targetPosition > 0 && columnData.push(columnList[targetPosition])
      columnData.push(columnList[sourcePosition])
      // 推入原始位置与目标位置之间的数据
      data.push(...tableColumn.slice(targetPosition + 1 > 0 ? targetPosition + 1 : 0, sourcePosition))
      columnData.push(...columnList.slice(targetPosition + 1 > 0 ? targetPosition + 1 : 0, sourcePosition))
      // 拖动组件后面的数据也推入
      if (sourcePosition < tableColumn.length - 1) {
        data.push(...tableColumn.slice(sourcePosition + 1))
        columnData.push(...columnList.slice(sourcePosition + 1))
      }
    }
    setTableColumn(data)
    setColumnList(columnData)
  }
  // 将入参的表格列信息解析成列设置中Tree组件所需格式
  const generateColumnSettingNode = () => {
    props.columns &&
      setColumnList(
        props.columns.map((item) => {
          return { key: (item as any).dataIndex || item.title, title: item.title } as DataNode
        })
      )
  }

  // 标题栏
  const columnSettingTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Checkbox
        indeterminate={indeterminate}
        checked={checkAll}
        onChange={(e) => columnSettingCheckAll(e.target.checked)}
      >
        列展示
      </Checkbox>
      <Button
        type="link"
        onClick={() => {
          generateColumnSettingNode()
          columnSettingCheckAll(true)
        }}
      >
        重置
      </Button>
    </div>
  )
  // 内容部分
  const columnSettingContent = (
    <div>
      <Tree
        draggable
        blockNode
        checkable
        treeData={columnList}
        checkedKeys={tableColumn.map((item) => (item as any).dataIndex || item.title)}
        onCheck={(check) => columnSettingOnChecked(check as React.Key[])}
        onDrop={columnSettingOnDrop}
      />
    </div>
  )

  return (
    <>
      <div style={contentStyle}>
        {/* 工具栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2.4rem', flexWrap: 'wrap' }}>
          {/* 功能按钮区 */}
          <div>{props.children}</div>

          {/* table功能 */}
          <div>
            <Space size="small" wrap>
              <Tooltip title="刷新">
                <Button
                  disabled={props.loading}
                  loading={props.loading}
                  icon={<ReloadOutlined />}
                  size="small"
                  type="text"
                  onClick={() => props.tableChange && props.tableChange()}
                />
              </Tooltip>
              <Tooltip title="密度">
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: tableSizeDropdown,
                    selectedKeys: [tableSize],
                    onClick: (info) => setTableSize(info.key)
                  }}
                >
                  <Button disabled={props.loading} icon={<ColumnHeightOutlined />} size="small" type="text" />
                </Dropdown>
              </Tooltip>
              <Tooltip title="列设置">
                <Popover
                  title={columnSettingTitle}
                  content={columnSettingContent}
                  trigger="click"
                  placement="bottomRight"
                >
                  <Button disabled={props.loading} icon={<SettingOutlined />} size="small" type="text" />
                </Popover>
              </Tooltip>
            </Space>
          </div>
        </div>

        <Table
          size={tableSize as SizeType}
          rowKey={props.rowKey || 'id'}
          loading={props.loading}
          rowSelection={{ fixed: 'left' }}
          columns={tableColumn}
          dataSource={props.data.records}
          pagination={pageConfig}
        />
      </div>
    </>
  )
}

/**
 * 表格大小调整下拉菜单定义
 */
const tableSizeDropdown: MenuProps['items'] = [
  {
    key: 'large',
    label: '默认'
  },
  {
    key: 'middle',
    label: '中等'
  },
  {
    key: 'small',
    label: '紧凑'
  }
]

export default memo(CommonTable)
