import styled from 'styled-components'
import { CSS_COMMON_GAP } from '@/global/constant'

export const DivWrapper = styled.div`
  margin: 2.4rem 1.6rem 2.4rem 0;
  padding: 0 ${CSS_COMMON_GAP};

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.025);
  }
`
