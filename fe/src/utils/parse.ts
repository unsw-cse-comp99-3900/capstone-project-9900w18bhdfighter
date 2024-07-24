import { AxiosError, isAxiosError } from 'axios'
import dayjs from 'dayjs'

const shortName = (firstName = '', lastName = '') => {
  console.log('firstName:', firstName)

  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
}

const isDarkColor = (color = '') => {
  const rgb = parseInt(color.substring(1), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance < 140
}
const stringToColorPair = (input = '') => {
  const colors = [
    '#1abc9c', // 绿松石
    '#2ecc71', // 翡翠
    '#3498db', // 深蓝
    '#9b59b6', // 紫罗兰
    '#34495e', // 湿石板
    '#16a085', // 绿海
    '#27ae60', // 草地
    '#2980b9', // 奈利
    '#8e44ad', // 鬼王
    '#2c3e50', // 海军蓝
    '#f1c40f', // 太阳花
    '#e67e22', // 胡萝卜
    '#e74c3c', // 苍红
    '#ecf0f1', // 云
    '#95a5a6', // 混凝土
  ]

  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash)
  }
  hash = Math.abs(hash)

  const color1 = colors[hash % colors.length]

  const color2 = isDarkColor(color1) ? '#FFFFFF' : '#000000'

  return [color1, color2]
}

const errHandler = (
  err: unknown,
  axiosErrDo: (_errStr: string) => void,
  otherErrDo: (_errStr: string) => void
) => {
  if (isAxiosError(err)) {
    const error = err as AxiosError<{ error: string; errors: string }>
    const data = error.response?.data

    if (error.status === 500) {
      axiosErrDo('Something went wrong')
      return
    }
    if (data) {
      axiosErrDo(data.error || data.errors || JSON.stringify(data))
    }
  } else {
    console.log('err:', err)
    otherErrDo('Technical error, please view logs of console')
  }
}
const ids_to_channel_id = (ids: [number, number]) => {
  return ids.sort((a, b) => a - b).join('_')
}
const channel_id_to_ids = (channel_id: string) => {
  return channel_id.split('_').map(Number) as [number, number]
}
const timeFormat = (iso: string, time = true) => {
  if (!time) return dayjs(iso).format('DD/MM/YYYY')
  return dayjs(iso).format('DD/MM/YY HH:mm')
}
const daysFromTime = (dueTime: string) => {
  return dayjs(dueTime).diff(dayjs(), 'day')
}

const isDue = (dueTime: string) => {
  console.log('dueTime:', dueTime)
  console.log('dayjs(dueTime):', dayjs().format('YYYY-MM-DD HH:mm:ss'))

  return dayjs(dueTime) <= dayjs()
}
export {
  shortName,
  isDarkColor,
  stringToColorPair,
  errHandler,
  ids_to_channel_id,
  channel_id_to_ids,
  timeFormat,
  isDue,
  daysFromTime,
}
