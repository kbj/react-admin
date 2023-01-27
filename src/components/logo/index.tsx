import type { FC, ReactNode } from 'react'
import React, { memo } from 'react'
import { TitleImgWrapper, TitleSpanWrapper } from './style'
import logo from '@/assets/img/antd.svg'
import { CSSTransition } from 'react-transition-group'

interface IProps {
  children?: ReactNode
  collapsed?: boolean
  title?: string
  color?: string
  fontSize?: string
  logoSize?: number
}

const Logo: FC<IProps> = (props) => {
  return (
    <>
      {/*Logo图*/}
      <TitleImgWrapper src={logo} {...props} />
      {/*系统名称*/}
      <CSSTransition
        in={!props.collapsed}
        timeout={500}
        classNames="main-title"
      >
        <TitleSpanWrapper {...props}>
          {props.title || import.meta.env.VITE_SYSTEM_NAME
            ? props.title || import.meta.env.VITE_SYSTEM_NAME
            : '后台管理系统'}
        </TitleSpanWrapper>
      </CSSTransition>
    </>
  )
}

export default memo(Logo)
