import { Key, useState } from 'react'
import { useRequest } from 'ahooks'
import type { ICommonResponse } from '@/api/types/common'
import { Form } from 'antd'

/**
 * 自定义通用列表查询Hooks，不分页
 * @param service API请求方法
 * @param alwaysValue 请求参数的固定值
 * @param dataParse 对接口返回的数据处理方法
 */
export function useNoPage<REQ extends {}, RESP extends {}>(
  service: (...args: REQ[]) => Promise<ICommonResponse<RESP[]>>,
  alwaysValue?: {},
  dataParse?: (data: RESP[]) => RESP[]
) {
  // 初始化
  const [init, setInit] = useState<boolean>(false)

  // 列表搜索表单对象
  const [searchForm] = Form.useForm<REQ>()

  // 列表多选
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])

  // 数据
  const [data, setData] = useState<RESP[]>([])

  // 查询列表结果封装
  const { loading, run } = useRequest(service, {
    manual: true,
    loadingDelay: 100,
    onSuccess: (resp) => {
      setData(dataParse ? dataParse(resp.data) : resp.data)
    }
  })

  // 查询数据接口
  const query = (param: REQ) => {
    param = alwaysValue ? { ...param, ...alwaysValue } : param // 固定值
    run(param)
  }

  return {
    init,
    setInit,
    searchForm,
    query,
    data,
    selectedRowKeys,
    setSelectedRowKeys,
    loading
  }
}
