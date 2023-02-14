import type { FC, ReactNode } from 'react'
import React, { memo, useEffect, useState } from 'react'
import { Button, Card, Checkbox, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import Logo from '@/components/logo'
import { LoginWrapper } from '@/views/login/style'
import { CSS_COMMON_GAP } from '@/global/constant'
import { useRequest } from 'ahooks'
import { getMenus, getUserInfo, login } from '@/api/login'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/common'
import { useRouteStore } from '@/store/common/route'

interface IProps {
  children?: ReactNode
}

const Login: FC<IProps> = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const updateUserInfo = useUserStore((state) => state.updateUserInfo)
  const updateMenuList = useRouteStore((state) => state.updateMenuList)
  // 登录
  const { run } = useRequest(login, {
    manual: true,
    onBefore: () => {
      setLoading(true)
    },
    onSuccess: () => {
      requestUserInfo.run()
      requestMenuInfo.run()
    }
  })
  // 查询用户信息
  const requestUserInfo = useRequest(getUserInfo, {
    manual: true,
    onSuccess: (result) => updateUserInfo(result.data)
  })
  // 查询菜单路由注册信息
  const requestMenuInfo = useRequest(getMenus, {
    manual: true,
    onSuccess: (result) => {
      updateMenuList(result.data)
      message.success('登录成功')
      // 跳转到主页面
      navigate('/')
    },
    onFinally: () => setLoading(false)
  })

  useEffect(() => {
    // 打开登录页需要重置token和用户信息
    useUserStore.getState().reset()
  }, [])

  return (
    <LoginWrapper>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Logo />
      </div>

      <Card style={{ width: 350, marginTop: CSS_COMMON_GAP }}>
        <Form
          form={form}
          name="loginForm"
          labelCol={{ span: 5 }}
          size="large"
          initialValues={{ rememberMe: true }}
          onFinish={(loginForm) => run(loginForm)}
        >
          {/*用户名*/}
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 5, max: 32, message: '用户名的长度为5-32' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>

          {/*密码*/}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 32, message: '密码的长度为6-32' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          {/*记住登录*/}
          <Form.Item>
            <Form.Item name="rememberMe" valuePropName="checked" noStyle>
              <Checkbox>记住登录</Checkbox>
            </Form.Item>
          </Form.Item>

          {/*登录按钮*/}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </LoginWrapper>
  )
}

export default memo(Login)
