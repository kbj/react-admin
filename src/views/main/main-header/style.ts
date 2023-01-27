import styled from 'styled-components'
import { ReactNode } from 'react'

interface IProp {
  children?: ReactNode
  hoverColor: string
}

export const CollapseIconWrapper = styled.span<IProp>`
  margin: 2.4rem 1.6rem;
  font-size: 1.8rem;

  &:hover {
    color: ${(props) => props.hoverColor};
  }
`
