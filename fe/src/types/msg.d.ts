interface Msg {
  content: string
  senderId: number
  senderName: string
  msgId: number
}

interface MsgReqDTO {
  channelType: 'GROUP' | 'PERSONAL'
  content: string
  receiverId: number
}
interface MsgRspDTO {
  status_code: number
  content?: string
  senderId?: number
  receiverId?: number
  channelType?: 'GROUP' | 'PERSONAL'
}
export { Msg, MsgReqDTO, MsgRspDTO }
