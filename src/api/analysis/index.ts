import api from '@/api'
import type { ICommonResponse } from '@/global/types/common'
import type { GoodsAmountList } from '@/global/types/analysis'

/**
 * 商品统计信息
 */
export function goodsAmountList() {
  return api.get<ICommonResponse<GoodsAmountList[]>>({
    url: '/goods/amount/list'
  })
}
