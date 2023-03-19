import type { FC } from 'react'
import React, { memo, useLayoutEffect, useState } from 'react'
import { Button, Checkbox, Popover, Tooltip, Tree, TreeProps } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import type { IProps } from './types'
import { ColumnsType } from 'antd/es/table'
import { DataNode } from 'antd/es/tree'

/**
 * 列设置封装
 */
const ColumnSetting: FC<IProps> = (props) => {
  const [init, setInit] = useState<boolean>(false) // 初始化
  const [columnList, setColumnList] = useState<DataNode[]>([]) // 列设置拖动列表
  const [checkAll, setCheckAll] = useState<boolean>(true) // 是否展示所有列
  const [indeterminate, setIndeterminate] = useState<boolean>(false) // 是否半选

  useLayoutEffect(() => {
    !init && created()
  }, [])

  /**
   * 列设置有变动重新生成表格列信息
   */
  useLayoutEffect(() => {
    // 重新生成tableColumn
    const newTableColumn: ColumnsType<any> = []
    columnList.map((column) => {
      const find = props.tableColumn.find((item) => (item as any).dataIndex === column.key || item.title === column.key)
      find && newTableColumn.push(find)
    })
    newTableColumn.length > 0 && props.setTableColumn(newTableColumn)
  }, [columnList])

  /**
   * 列设置有变动及时更新列设置
   */
  useLayoutEffect(() => {
    props.setTableColumn(props.columns)
  }, [props.columns])

  /**
   * 初始化方法
   */
  const created = () => {
    setInit(true)
    generateColumnSettingNode() // 初始化列数据
  }

  /**
   * 将入参的表格列信息解析成列设置中Tree组件所需格式
   */
  const generateColumnSettingNode = () => {
    props.columns &&
      setColumnList(
        props.columns.map((item) => {
          return { key: (item as any).dataIndex || item.title, title: item.title } as DataNode
        })
      )
  }

  /**
   * 列设置列表勾选事件
   */
  const columnSettingOnChecked = (checkedKeysValue: React.Key[]) => {
    // 更新tableColumn
    const newTableColumn: ColumnsType<any> = []
    columnList
      .filter((column) => checkedKeysValue.indexOf(column.key) > -1)
      .map((column) => {
        const find = props.columns.find((item) => (item as any).dataIndex === column.key || item.title === column.key)
        find && newTableColumn.push(find)
      })
    newTableColumn.length != props.tableColumn.length && props.setTableColumn(newTableColumn as ColumnsType<any>)

    // 全选/半选/非全选状态更新
    setCheckAll(checkedKeysValue.length === columnList.length)
    setIndeterminate(checkedKeysValue.length > 0 && checkedKeysValue.length !== columnList.length)
  }

  /**
   * 勾选/取消勾选全部事件
   */
  const columnSettingCheckAll = (checked: boolean) => {
    columnSettingOnChecked(checked ? columnList.map((item) => item.key) : [])
  }

  /**
   * 拖动事件
   */
  const columnSettingOnDrop: TreeProps['onDrop'] = (dropInfo) => {
    const sourcePosition = parseInt(dropInfo.dragNode.pos.split('-')[1]) // 拖动组件原始索引位置
    const targetPosition = dropInfo.dropPosition > 0 ? dropInfo.dropPosition - 1 : dropInfo.dropPosition // 拖动组件目标索引位置

    // 实际table列数组位置与列设置list位置组合
    const data = props.tableColumn.slice(0, Math.min(sourcePosition, targetPosition > 0 ? targetPosition : 0))
    const columnData = columnList.slice(0, Math.min(sourcePosition, targetPosition > 0 ? targetPosition : 0))

    if (sourcePosition < targetPosition) {
      // 往下拖拽
      // 推入原始位置与目标位置之间的数据
      data.push(...props.tableColumn.slice(sourcePosition + 1, targetPosition + 1))
      columnData.push(...columnList.slice(sourcePosition + 1, targetPosition + 1))
      // 推入拖动的数据
      data.push(props.tableColumn[sourcePosition]) && columnData.push(columnList[sourcePosition])
      // 目标位置后的数据也推入
      if (targetPosition < props.tableColumn.length - 1) {
        data.push(...props.tableColumn.slice(targetPosition + 1))
        columnData.push(...columnList.slice(targetPosition + 1))
      }
    } else if (sourcePosition > targetPosition) {
      // 往上拖拽
      // 推入拖动组件
      targetPosition > 0 && data.push(props.tableColumn[targetPosition])
      data.push(props.tableColumn[sourcePosition])
      targetPosition > 0 && columnData.push(columnList[targetPosition])
      columnData.push(columnList[sourcePosition])
      // 推入原始位置与目标位置之间的数据
      data.push(...props.tableColumn.slice(targetPosition + 1 > 0 ? targetPosition + 1 : 0, sourcePosition))
      columnData.push(...columnList.slice(targetPosition + 1 > 0 ? targetPosition + 1 : 0, sourcePosition))
      // 拖动组件后面的数据也推入
      if (sourcePosition < props.tableColumn.length - 1) {
        data.push(...props.tableColumn.slice(sourcePosition + 1))
        columnData.push(...columnList.slice(sourcePosition + 1))
      }
    }
    props.setTableColumn(data)
    setColumnList(columnData)
  }

  /*标题栏*/
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

  /*内容部分*/
  const columnSettingContent = (
    <div>
      <Tree
        draggable
        blockNode
        checkable
        treeData={columnList}
        checkedKeys={props.tableColumn.map((item) => (item as any).dataIndex || item.title)}
        onCheck={(check) => columnSettingOnChecked(check as React.Key[])}
        onDrop={columnSettingOnDrop}
      />
    </div>
  )

  return (
    <Tooltip title="列设置">
      <Popover title={columnSettingTitle} content={columnSettingContent} trigger="click" placement="bottomRight">
        <Button disabled={props.disabled} icon={<SettingOutlined />} size="small" type="text" />
      </Popover>
    </Tooltip>
  )
}

export default memo(ColumnSetting)
