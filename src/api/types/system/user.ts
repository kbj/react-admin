import { IPageRequest } from '@/api/types/common'

/**
 * 用户请求实体
 */
export interface IUserRequest extends IPageRequest {
  username?: string // 用户名
  mobile?: string // 手机号
  createTime?: number[] // 创建时间
}
