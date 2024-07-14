import { GroupMsgDTO, MsgRspDTO } from '../types/msg'
import api from './config'

const getAllMsgsMine = async () => {
  return api.get<MsgRspDTO[]>('api/messages')
}

const markMsgsFromOneContactAsRead = async (senderId: number) => {
  return api.put(`api/messages/mark-as-read/${senderId}`)
}
const getAllGroupMsgsMine = async () => {
  return api.get<GroupMsgDTO[]>('api/group-messages')
}
const markMsgsFromOneGroupAsRead = async (groupId: number) => {
  return api.put(`api/group-messages/mark-as-read/${groupId}`)
}
export {
  getAllMsgsMine,
  markMsgsFromOneContactAsRead,
  getAllGroupMsgsMine,
  markMsgsFromOneGroupAsRead,
}
