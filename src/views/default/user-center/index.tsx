import type { FC, PropsWithChildren } from 'react'
import React, { memo, useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Form, Input, message, Radio, Row, Tabs } from 'antd'
import ImageUpload from '@/components/image-upload'
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store/common'
import type { MyFileInfo } from '@/api/types/common/file'
import type { IResetPassword, IUser, IUserInfo } from '@/api/types/common'
import { updateAvatar, updatePassword, updateProfile } from '@/api/system/user'
import { useDict } from '@/hooks'

const UserCenter: FC<PropsWithChildren> = () => {
  const [init, setInit] = useState<boolean>(false)
  const userInfo = useUserStore((state) => state.userInfo)
  const updateUserInfo = useUserStore((state) => state.updateUserInfo)
  const [sysGender] = useDict('sys_gender')

  useEffect(() => {
    if (!init) {
      setInit(true)
      // 回显用户信息
      userInfo?.user && form.setFieldsValue(userInfo.user)
    }
  }, [])

  /**
   * 头像更新事件
   */
  const handleAvatarChange = (files: MyFileInfo[]) => {
    // 更新浏览器本地头像
    if (userInfo && files && files.length > 0) {
      const avatar = files && files.length > 0 ? files[0].url : ''

      // 提交接口并更新头像
      if (userInfo.user.avatar !== avatar) {
        updateAvatar(avatar).then((response) => {
          message.success('保存成功')
          const newUserInfo: IUserInfo = { ...userInfo, user: { ...userInfo.user, avatar: avatar } }
          updateUserInfo(newUserInfo)
        })
      }
    }
  }

  /**
   * 保存用户信息
   */
  const handleSaveProfile = (values: IUser) => {
    updateProfile(values).then(() => {
      message.success('保存成功')
      if (userInfo?.user) {
        const newUserInfo: IUserInfo = { ...userInfo, user: { ...userInfo.user, ...values } }
        updateUserInfo(newUserInfo)
      }
    })
  }

  /**
   * 更新密码
   */
  const handleSavePassword = (values: IResetPassword) => {
    if (values.newPassword !== values.confirmPassword) {
      message.warning('两次输入密码不一致')
      return
    }
    updatePassword(values).then(() => {
      message.success('保存成功')
      passwordForm.resetFields()
    })
  }

  /**
   * 基本资料更新
   */
  const [form] = Form.useForm<IUser>()
  const profileTab = (
    <Form
      name="form"
      form={form}
      onFinish={handleSaveProfile}
      autoComplete="off"
      labelAlign="right"
      initialValues={{ gender: 'M' }}
      labelCol={{ md: { span: 6 }, lg: { span: 4 } }}
    >
      <Form.Item
        label="用户昵称"
        name="nickName"
        rules={[
          { required: true, message: '用户昵称不能为空' },
          { max: 100, message: '用户昵称长度不能超过100' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="手机号码"
        name="mobile"
        rules={[
          { required: true, message: '手机号码不能为空' },
          { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '邮箱不能为空' },
          { max: 100, message: '邮箱长度不能超过100' },
          { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确的邮箱' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="性别" name="gender">
        <Radio.Group>
          {sysGender.map((item) => (
            <Radio value={item.dictValue} key={item.dictValue}>
              {item.dictLabel}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  )

  /**
   * 密码更新
   */
  const [passwordForm] = Form.useForm<IResetPassword>()
  const passwordTab = (
    <Form
      name="passwordForm"
      form={passwordForm}
      onFinish={handleSavePassword}
      autoComplete="off"
      labelAlign="right"
      labelCol={{ md: { span: 6 }, lg: { span: 4 } }}
      initialValues={{}}
    >
      <Form.Item
        label="当前密码"
        name="currentPassword"
        rules={[
          { required: true, message: '当前密码不能为空' },
          {
            min: 8,
            max: 32,
            message: '密码长度8-32位'
          }
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="新密码"
        name="newPassword"
        rules={[
          { required: true, message: '新密码不能为空' },
          {
            pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~\\.!@#$%^&*])[a-zA-Z\d~\\.!@#$%^&*]{8,32}$/,
            message: '新密码长度8-32且必须存在特殊字符、英文、数字'
          }
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="confirmPassword"
        rules={[
          { required: true, message: '确认密码不能为空' },
          {
            pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~\\.!@#$%^&*])[a-zA-Z\d~\\.!@#$%^&*]{8,32}$/,
            message: '确认密码长度8-32且必须存在特殊字符、英文、数字'
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('两次输入的密码不一致'))
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <Row>
      <Col md={24} lg={6}>
        <Card title="个人信息">
          <Row justify="center" align="middle">
            <Col>
              <ImageUpload
                value={userInfo?.user.avatar ? [{ url: userInfo?.user.avatar, fileName: 'avatar' }] : undefined}
                limit={1}
                listType="picture-circle"
                cropShape="round"
                onChange={handleAvatarChange}
              />
            </Col>
          </Row>
          <Divider />
          <Row justify="space-between">
            <Col span={6} offset={1} style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 'bold' }}>
                <UserOutlined />
                用户名称
              </p>
            </Col>
            <Col span={8} offset={9} style={{ textAlign: 'right' }}>
              <p>{userInfo?.user.nickName}</p>
            </Col>

            <Col span={6} offset={1} style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 'bold' }}>
                <PhoneOutlined />
                手机号码
              </p>
            </Col>
            <Col span={8} offset={9} style={{ textAlign: 'right' }}>
              <p>{userInfo?.user.mobile}</p>
            </Col>

            <Col span={6} offset={1} style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 'bold' }}>
                <MailOutlined />
                用户邮箱
              </p>
            </Col>
            <Col span={8} offset={9} style={{ textAlign: 'right' }}>
              <p>{userInfo?.user.email}</p>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col md={24} lg={17} offset={1}>
        <Card title="基本资料">
          <Tabs
            defaultActiveKey="1"
            items={[
              { key: '1', label: '基本资料', children: profileTab },
              { key: '2', label: '修改密码', children: passwordTab }
            ]}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default memo(UserCenter)
