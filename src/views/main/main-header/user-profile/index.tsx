import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import type { MenuProps } from 'antd'
import { Avatar, Dropdown, message, Space } from 'antd'
import { useUserStore } from '@/store/common'
import { DivWrapper } from './style'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface IProps {
  children?: ReactNode
}

const UserProfile: FC<IProps> = () => {
  const userInfo = useUserStore((state) => state.userInfo)
  const navigate = useNavigate()

  // 注销登录方法
  const logout = () => {
    message.success('退出成功')
    navigate('/login')
  }

  const items: MenuProps['items'] = [
    {
      key: '0',
      icon: <UserOutlined />,
      label: <a onClick={() => navigate('/main/user-center')}>个人中心</a>
    },
    {
      type: 'divider'
    },
    {
      key: '1',
      icon: <LogoutOutlined />,
      label: <a onClick={logout}>退出登录</a>
    }
  ]

  return (
    <DivWrapper>
      <Dropdown menu={{ items }}>
        <Space>
          <Avatar
            src={userInfo?.user.avatar || 'https://upload.jianshu.io/users/upload_avatars/1102036/c3628b478f06.jpeg'}
          />
          <span
            style={{
              fontSize: '1.6rem'
            }}
          >
            {userInfo?.user.username}
          </span>
        </Space>
      </Dropdown>
    </DivWrapper>
  )
}

export default memo(UserProfile)
