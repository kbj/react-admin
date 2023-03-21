import React, { useState } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'

/**
 * 弹窗Hooks
 */
export function useModal() {
  // 标题
  const [title, setTitle] = useState<string>('')

  // 是否显示
  const [open, setOpen] = useState<boolean>(false)

  // 确认按钮加载状态
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  // 删除弹窗确认
  const deleteConfirm = (onOk: (...args: any[]) => any) => {
    Modal.confirm({
      title: '警告',
      icon: <ExclamationCircleFilled />,
      content: '确认要删除吗？',
      onOk
    })
  }

  return { title, setTitle, open, setOpen, confirmLoading, setConfirmLoading, deleteConfirm }
}
