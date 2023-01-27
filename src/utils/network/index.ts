import axios, { AxiosInstance } from 'axios'
import type { MyRequestInterceptors } from '@/utils/network/types'
import { MyRequestConfig } from '@/utils/network/types'

class MyRequest {
  instance: AxiosInstance
  interceptors?: MyRequestInterceptors

  constructor(config: MyRequestConfig) {
    // 创建axios实例
    this.instance = axios.create(config)

    // 保存其他基本信息
    this.interceptors = config.interceptors

    // 使用拦截器
    // 1.从config中取出的拦截器是对应的实例的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )

    // 2.添加所有的实例都有的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (err) => {
        return Promise.reject(err)
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        return res
      },
      (err) => {
        return Promise.reject(err)
      }
    )
  }

  /**
   * 基础请求方法
   * @param config  请求配置信息
   */
  request<T = any>(config: MyRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 1.单个请求对请求config的处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          // 2.其他处理

          // 3.将结果resolve返回出去
          resolve(res)
        })
        .catch((err) => {
          reject(err)
          return err
        })
    })
  }

  get<T = any>(config: MyRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }

  post<T = any>(config: MyRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }

  delete<T = any>(config: MyRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }

  patch<T = any>(config: MyRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}

export default MyRequest
