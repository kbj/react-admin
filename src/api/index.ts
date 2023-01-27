import MyRequest from '@/utils/network'
import { API_SUCCESS_CODE } from '@/global/constant'
import type { AxiosHeaders } from 'axios'
import { message } from 'antd'
import { useUserStore } from '@/store/common'

export default new MyRequest({
  baseURL: import.meta.env.VITE_API_BASE as string,
  timeout: 10000,
  // 当前请求为跨域类型时是否在请求中协带cookie
  withCredentials: false,
  interceptors: {
    requestInterceptor: (config) => {
      // 判断是否有token，携带token
      const token = useUserStore.getState().token
      if (token) {
        const headers = config.headers as AxiosHeaders
        headers.set('Authorization', `Bearer ${token}`)
      }
      return config
    },
    responseInterceptor: (resp) => {
      // （成功请求状态下执行的拦截器）
      // 判断业务状态码
      const code = resp.data.code || API_SUCCESS_CODE
      if (code !== API_SUCCESS_CODE) {
        // 业务状态码不对统一返回错误提示
        message.error(resp.data.msg)
        return Promise.reject(resp.data.msg)
      }

      // 判断返回是否有token，并更新
      const headers = resp.headers as AxiosHeaders
      const authorization = headers.get('Authorization')
      if (authorization) {
        useUserStore.getState().setToken(authorization as string)
      }
      return resp.data
    },
    responseInterceptorCatch: (err) => {
      // 请求失败或HTTP状态码不在有效状态码中
      message.error(err?.response?.data?.msg || err.message)
      return Promise.reject(err)
    }
  }
})
