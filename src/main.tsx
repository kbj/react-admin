import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'normalize.css'
import '@/assets/css/init.css'
import zhCN from 'antd/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'

import App from '@/App'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
)
