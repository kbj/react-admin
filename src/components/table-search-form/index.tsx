import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import { Button, Col, DatePicker, Form, Input, Row, Space, theme } from 'antd'
import type { TableSearchFormItem } from '@/components/table-search-form/types'
import { FormItemType } from '@/components/table-search-form/types'
import dayjs from 'dayjs'

interface IProps {
  children?: ReactNode
  config: TableSearchFormItem[]
  loading?: boolean // 加载状态
  submit: (data: any) => void
}

const TableSearchForm: FC<IProps> = (props) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()

  // 表单样式
  const formStyle = {
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    padding: `2.4rem`
  }

  // 提交表单内容
  const onFinish = (values: any) => {
    // 判断是否有时间格式并将dayjs格式转为时间戳
    const timeConfigs = props.config.filter(
      (item) =>
        item.itemType === FormItemType.Date ||
        item.itemType === FormItemType.DateTime
    )
    if (timeConfigs && timeConfigs.length > 0) {
      for (const timeConfig of timeConfigs) {
        if (values[timeConfig.fieldName]) {
          values[timeConfig.fieldName] = [
            (values[timeConfig.fieldName][0] as dayjs.Dayjs).valueOf(),
            (values[timeConfig.fieldName][1] as dayjs.Dayjs).valueOf()
          ]
        }
      }
    }
    props.submit(values)
  }

  // 动态表单内容
  const formItems = props.config.map((item, index) => {
    return (
      <Col
        xs={24}
        sm={24}
        md={12}
        lg={8}
        xl={6}
        key={index}
        hidden={item.hidden}
      >
        <Form.Item name={item.fieldName} label={item.label} rules={item.rules}>
          {(() => {
            switch (item.itemType) {
              case FormItemType.Date:
                // 日期类型
                return <DatePicker.RangePicker />
              case FormItemType.DateTime:
                // 日期附带时间类型
                return <DatePicker.RangePicker showTime showNow />
              default:
                // 默认和输入类型
                return <Input placeholder={'请输入' + item.label} />
            }
          })()}
        </Form.Item>
      </Col>
    )
  })

  return (
    <>
      <Form
        form={form}
        name="search-form"
        style={formStyle}
        labelAlign="right"
        onFinish={onFinish}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {formItems}
          {formItems &&
            formItems.length > 0 &&
            props.config.filter((item) => !item.hidden).length > 0 && (
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={props.loading}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields()
                      form.submit()
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Col>
            )}
        </Row>
      </Form>
    </>
  )
}

export default memo(TableSearchForm)
