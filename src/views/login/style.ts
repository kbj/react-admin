import styled from 'styled-components'
import loginBackGround from '@/assets/img/login-bg.svg'

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-image: url(${loginBackGround});
  background-color: rgb(240, 242, 245);
  background-position-x: 50%;
  background-position-y: 11rem;
`
