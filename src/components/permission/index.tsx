import type { FC, PropsWithChildren } from 'react'
import React, { memo } from 'react'
import { useUserStore } from '@/store/common'

/**
 * 权限判断组件
 */
interface IProps extends PropsWithChildren {
  hasPermission: string[]
}
const adminPermission = '*:*:*'

const Permission: FC<IProps> = (props) => {
  const userInfo = useUserStore((state) => state.userInfo)

  if (userInfo && userInfo.permissions && userInfo.permissions.indexOf(adminPermission) > -1) {
    return <>{props.children}</>
  }

  if (userInfo && userInfo.permissions && userInfo.permissions.length > 0) {
    for (const per of props.hasPermission) {
      if (userInfo.permissions.indexOf(per) > -1) {
        return <>{props.children}</>
      }
    }
  }

  return <></>
}

export default memo(Permission)
