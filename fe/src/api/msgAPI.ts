import { MsgRspDTO } from '../types/msg'
import api from './config'

const getAllMsgsMine = async () => {
  return api.get<MsgRspDTO[]>('api/messages')
}

const markMsgsFromOneContactAsRead = async (senderId: number) => {
  return api.put(`api/messages/mark-as-read/${senderId}`)
}

export { getAllMsgsMine, markMsgsFromOneContactAsRead }
