import dayjs from 'dayjs'

/**
 * 解析时间戳
 * @param timestamp 时间戳
 * @param format    时间格式
 */
export const parseTimeStamp = (timestamp: number, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(timestamp).format(format)
}
