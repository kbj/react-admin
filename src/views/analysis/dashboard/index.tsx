import type { FC, ReactNode } from 'react'
import React, { memo, useEffect, useState } from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import { goodsAmountList } from '@/api/analysis'
import { GoodsAmountList } from '@/global/types/analysis'
import CountUp from 'react-countup'

interface IProps {
  children?: ReactNode
}

const Dashboard: FC<IProps> = () => {
  const [amountList, setAmountList] = useState<GoodsAmountList[]>([])
  useEffect(() => {
    goodsAmountList().then((resp) => setAmountList(resp.data))
  }, [])

  return (
    <>
      <Row gutter={16}>
        {amountList.map((item, index) => {
          return (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card title={item.title}>
                <Statistic
                  value={item.number1}
                  formatter={(value) => (
                    <CountUp end={value as number} separator="," />
                  )}
                />
              </Card>
            </Col>
          )
        })}
      </Row>
    </>
  )
}

export default memo(Dashboard);
