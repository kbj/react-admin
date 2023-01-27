import styled from 'styled-components'
import { ReactNode } from 'react'
import {
  CSS_BOLD_FONT_WEIGHT,
  CSS_DEFAULT_BLACK_COLOR,
  CSS_TITLE_FONT_SIZE
} from '@/global/constant'

interface IProps {
  children?: ReactNode
  collapsed?: boolean
  color?: string
  fontSize?: string
  logoSize?: number
}

export const TitleImgWrapper = styled.img<IProps>`
  width: ${(props) => (props.logoSize ? props.logoSize + 'rem' : '4.8rem')};
  height: ${(props) => (props.logoSize ? props.logoSize + 'rem' : '4.8rem')};
  transition: 200ms ease;
`

export const TitleSpanWrapper = styled.span<IProps>`
  color: ${(props) => (props.color ? props.color : CSS_DEFAULT_BLACK_COLOR)};
  font-size: ${(props) =>
    props.fontSize ? props.fontSize : CSS_TITLE_FONT_SIZE};
  font-weight: ${CSS_BOLD_FONT_WEIGHT};
  margin-left: ${(props) => (props.collapsed ? 0 : '1.2rem')};
  white-space: nowrap;
  display: ${(props) => (props.collapsed ? 'none' : 'block')};

  &.main-title-enter {
    opacity: 0;
  }
  &.main-title-enter-active {
    opacity: 1;
    transition: opacity 500ms ease;
  }
`
