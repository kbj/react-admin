import type { FC, ReactNode } from 'react'
import React, { memo, useEffect } from 'react'
import { Button, Card, Checkbox, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import Logo from '@/components/logo'
import { LoginWrapper } from '@/views/login/style'
import { CSS_COMMON_GAP } from '@/global/constant'
import { useRequest } from 'ahooks'
import { login } from '@/api/login'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/common'

interface IProps {
  children?: ReactNode
}

const Login: FC<IProps> = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const setToken = useUserStore((state) => state.setToken)
  const setUserId = useUserStore((state) => state.setUserId)
  // 表单提交
  const { loading, run } = useRequest(login, {
    manual: true,
    loadingDelay: 300,
    onSuccess: (data) => {
      message.success('登录成功')

      // 缓存用户信息以及token
      setToken(data.data.token)
      setUserId(data.data.id)

      // 跳转到主页面
      navigate('/')
    }
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
            name="name"
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
