import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import { Layout, theme } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { CollapseIconWrapper } from '@/views/main/main-header/style'
import UserProfile from '@/views/main/main-header/user-profile'

interface IProps {
  children?: ReactNode
  collapsed?: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const MainHeader: FC<IProps> = (props) => {
  const {
    token: { colorBgContainer, colorPrimary }
  } = theme.useToken()

  return (
    <Layout.Header
      style={{
        padding: 0,
        background: colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <CollapseIconWrapper hoverColor={colorPrimary}>
        {/*收缩图标*/}
        {React.createElement(
          props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            onClick: () => props.setCollapsed(!props.collapsed)
          }
        )}
      </CollapseIconWrapper>

      {/*用户信息*/}
      <UserProfile />
    </Layout.Header>
  )
}

export default memo(MainHeader)
