import type { FC } from 'react'
import React, { memo, useState } from 'react'
import type { MenuProps, TablePaginationConfig } from 'antd'
import { Button, Dropdown, Space, Table, theme, Tooltip } from 'antd'
import { ColumnHeightOutlined, ReloadOutlined } from '@ant-design/icons'
import type { SizeType } from 'antd/es/config-provider/SizeContext'
import type { IProps } from './types'
import { ColumnsType } from 'antd/es/table'
import ColumnSetting from './column-setting'

/**
 * 项目用Table自封装
 */
const CommonTable: FC<IProps> = (props) => {
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
  // 列设置
  const [tableColumn, setTableColumn] = useState<ColumnsType<any>>(props.columns)

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
    onChange: (page: number, pageSize: number) => props.pageChange && props.pageChange({ pageNum: page, pageSize }) // 分页器改变方法
  }

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
                  onClick={() => props.pageChange && props.pageChange({})}
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
              {/*列设置*/}
              <ColumnSetting
                disabled={props.loading}
                columns={props.columns}
                tableColumn={tableColumn}
                setTableColumn={setTableColumn}
              />
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
