import { Key, useState } from 'react'
import { useRequest } from 'ahooks'
import type { ICommonPageResponse, ICommonResponse, IPageRequest } from '@/api/types/common'
import { Form } from 'antd'

/**
 * 自定义通用列表查询Hooks
 * @param service API请求方法
 * @param alwaysValue 固定值
 */
export function usePage<REQ extends IPageRequest, RESP extends {}>(
  service: (...args: REQ[]) => Promise<ICommonResponse<ICommonPageResponse<RESP>>>,
  alwaysValue?: {}
) {
  // 初始化
  const [init, setInit] = useState<boolean>(false)

  // 列表搜索表单对象
  const [searchForm] = Form.useForm<REQ>()

  // 列表多选
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])

  // 请求参数
  const [queryParam, setQueryParam] = useState<REQ>({ pageNum: 1, pageSize: 10 } as REQ)

  // 数据
  const [data, setData] = useState<ICommonPageResponse<RESP>>({
    pageNum: queryParam.pageNum || 1,
    pageSize: queryParam.pageSize || 10,
    total: 0,
    records: []
  })

  // 查询列表结果封装
  const { loading, run } = useRequest(service, {
    manual: true,
    loadingDelay: 100,
    onSuccess: (resp) => {
      setQueryParam({ ...queryParam, pageNum: resp.data.pageNum, pageSize: resp.data.pageSize })
      setData(resp.data)
    }
  })

  // 查询数据接口
  const query = (param: REQ) => {
    param.pageNum = param.pageNum || queryParam.pageNum
    param.pageSize = param.pageSize || queryParam.pageSize
    param = alwaysValue ? { ...param, ...alwaysValue } : param // 固定值
    run(param)
  }

  /**
   * 分页信息更新回调方法
   * @param page 分页信息
   */
  const pageChange = (page: IPageRequest) => {
    page &&
      setQueryParam({
        ...queryParam,
        pageNum: page.pageNum || queryParam.pageNum,
        pageSize: page.pageSize || queryParam.pageSize
      })
    searchForm.submit()
  }

  return {
    init,
    setInit,
    searchForm,
    queryParam,
    query,
    pageChange,
    data,
    selectedRowKeys,
    setSelectedRowKeys,
    loading
  }
}
