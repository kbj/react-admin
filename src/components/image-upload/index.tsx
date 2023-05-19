import type { FC, PropsWithChildren } from 'react'
import React, { memo, useEffect, useState } from 'react'
import { message, Modal, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store/common'
import type { RcFile, UploadFile, UploadListType, UploadProps } from 'antd/es/upload/interface'
import type { UploadChangeParam } from 'antd/lib/upload'
import { ICommonResponse } from '@/api/types/common'
import { API_SUCCESS_CODE } from '@/global/constant'
import ImgCrop from 'antd-img-crop'
import type { MyFileInfo } from '@/api/types/common/file'

interface IProps extends PropsWithChildren {
  value?: MyFileInfo[] // 自定义表单控件所需属性
  onChange?: (value: MyFileInfo[]) => void // 自定义表单控件所需事件
  limit?: number // 默认上传个数
  fileSize?: number // 大小限制(MB)
  listType?: UploadListType // 内建样式
  cropShape?: 'rect' | 'round' // 裁剪形状
  tooltip?: boolean // 是否展示提示文字
}
const baseUrl = import.meta.env.VITE_API_BASE as string

/**
 * 上传图片组件封装
 */
const ImageUpload: FC<IProps> = ({
  limit = 5,
  fileSize = 5,
  listType = 'picture-card',
  cropShape,
  value = [],
  onChange
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(value && value.length > 0 ? generateFileList(value) : [])
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  /**
   * 上传状态变更后触发更新事件
   */
  useEffect(() => {
    const newObj = fileList
      .filter((file) => file.url && (file.status === 'success' || file.status === 'done'))
      .map((file) => ({
        url: file.url || '',
        fileName: file.name
      }))
    onChange?.(newObj)
  }, [fileList])

  /**
   * 上传前文件的检查
   */
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('您只能上传JPG/PNG文件!')
    }
    const overFileSize = file.size / 1024 / 1024 < fileSize
    if (!overFileSize) {
      message.error(`图片文件不能超过 ${fileSize}MB!`)
    }
    return isJpgOrPng && overFileSize
  }

  /**
   * 上传状态变更事件回调
   */
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    setFileList(
      info.fileList
        .filter((file) => file.status)
        .map((file) => {
          if (file.status !== 'done') {
            return file
          }
          // 上传完毕
          const response = info.file.response as ICommonResponse
          if (response.code !== API_SUCCESS_CODE) {
            file.status = 'error'
            message.error(`上传失败！${response.msg}`)
            return file
          }
          file.url = `${baseUrl}common/file/static${response.data.path}`
          return file
        })
    )
  }

  /**
   * 图片预览
   */
  const handlePreview = async (file: UploadFile) => {
    if (file.url) {
      setPreviewImage(file.url)
      setPreviewOpen(true)
    }
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj as RcFile)
    // }
    //
    // setPreviewImage(file.url || (file.preview as string))
    // setPreviewOpen(true)
  }

  return (
    <>
      <ImgCrop rotationSlider quality={1} showReset cropShape={cropShape}>
        <Upload
          name="file"
          listType={listType}
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onPreview={handlePreview}
          action={`${baseUrl}common/file/upload`}
          headers={{ Authorization: `Bearer ${useUserStore.getState().token}` }}
        >
          {fileList.length >= limit ? null : <PlusOutlined />}
        </Upload>
      </ImgCrop>
      <Modal open={previewOpen} title="查看" footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const generateFileList = (value: MyFileInfo[]): UploadFile[] => {
  return value.map((u, index) => ({
    uid: index + '',
    name: u.fileName || index + '',
    url: u.url,
    status: 'done'
  }))
}

export default memo(ImageUpload)
