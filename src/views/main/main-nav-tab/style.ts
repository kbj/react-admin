import styled from 'styled-components'
import type { ReactNode } from 'react'

interface IProps {
  children?: ReactNode
  primaryColor: string
  backGroundColor: string
}

export const DivWrapper = styled.div<IProps>`
  margin-top: 0.2rem;
  position: relative;
  border-bottom: 0.1rem solid #e4e7ed;
  background: ${(props) => props.backGroundColor};

  .ant-tabs {
    padding: 0 9rem 0 1.3rem;

    .ant-tabs-nav {
      margin: 0;

      &::before {
        border: none;
      }

      .ant-tabs-ink-bar {
        visibility: visible;
      }

      .ant-tabs-tab-with-remove.ant-tabs-tab-active {
        .ant-tabs-tab-remove {
          top: 0.5rem;
          margin: 0.7rem;
          color: ${(props) => props.primaryColor} !important;
          opacity: 1 !important;
        }

        .ant-tabs-tab-btn {
          transform: translateX(-0.9rem);
        }
      }

      .ant-tabs-tab {
        padding: 0.8rem 2.2rem;
        color: #cccccc;
        background: none;
        border: none;
        transition: none;

        .ant-tabs-tab-remove {
          position: absolute;
          right: 0;
          color: #cccccc;
          opacity: 0;
          transition: 0.1s ease-in-out;

          &:hover {
            color: ${(props) => props.primaryColor};
          }
        }
      }

      .ant-tabs-tab.ant-tabs-tab-with-remove {
        &:hover {
          .ant-tabs-tab-remove {
            top: 0.5rem;
            margin: 0.7rem;
            opacity: 1;
            transition: 0.1s ease-in-out;
          }

          .ant-tabs-tab-btn {
            transform: translateX(-0.9rem);
          }
        }
      }
    }
  }

  /* tabs 不受全局组件大小影响 */

  .ant-tabs-small > .ant-tabs-nav .ant-tabs-tab,
  .ant-tabs-large > .ant-tabs-nav .ant-tabs-tab {
    padding: 0.8rem 2.2rem !important;
    font-size: 1.4rem !important;
  }
`
