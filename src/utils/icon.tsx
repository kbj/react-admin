// 导入图标库
import * as Icon from '@ant-design/icons'
import React from 'react'

/**
 * 动态根据字符串名称生成对应的菜单图标
 * @param name  图标名称
 */
export const iconToElement = (name: string) =>
  React.createElement(Icon && (Icon as any)[name], {
    style: { fontSize: '16px' }
  })
