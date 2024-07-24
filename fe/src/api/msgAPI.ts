import {
  GroupContact,
  GroupContactRspDTO,
  GroupMsgDTO,
  Msg,
  MsgGrouped,
  MsgRspDTO,
} from '../types/msg'
import api from './config'
import { mapGroupDTOToGroup } from './groupAPI'

const getAllMsgsMine = async () => {
  return api.get<MsgRspDTO[]>('api/messages')
}

const markMsgsFromOneContactAsRead = async (senderId: number) => {
  return api.put(`api/messages/mark-as-read/${senderId}`)
}
const markMsgsFromOneGroupAsRead = async (groupId: number) => {
  return api.put(`api/group-messages/mark-as-read/${groupId}`)
}
const getAllGroupMsgsMine = async () => {
  return api.get<{ data: GroupMsgDTO[] }>('api/group-messages')
}

const getAllGroupContactMine = async () => {
  return api.get<{ data: GroupContactRspDTO[] }>('api/contacts/groups')
}

//mapper
const mapGroupMsgDTOToMsgGrouped: (
  _groupMsgDTO: GroupMsgDTO[],
  _userId: number
) => MsgGrouped = (groupMsgDTO, userId) => {
  const groupedMsgs = groupMsgDTO.reduce((acc, curr) => {
    if (!acc[curr.ReceiverGroup]) {
      acc[curr.ReceiverGroup] = []
    }
    acc[curr.ReceiverGroup]?.push({
      content: curr.Content,
      senderId: curr.Sender,
      receiverId: curr.ReceiverGroup,
      createdAt: curr.CreatedAt,
      isRead: curr.ReadBy.includes(userId),
      ChannelId: curr.ChannelId,
    })
    return acc
  }, {} as MsgGrouped)
  return groupedMsgs
}
const mapGroupContactDTOToGroupContact: (
  _groupContact: GroupContactRspDTO
) => GroupContact = (groupContactDTO) => {
  const { UnreadMsgsCount, ...rest } = groupContactDTO
  return {
    ...mapGroupDTOToGroup(rest),
    unreadMsgsCount: UnreadMsgsCount,
  }
}
const mapGroupMsgRspDTOToMsg: (
  _groupMsgDTO: GroupMsgDTO,
  _userId: number
) => Msg = (groupMsgDTO, userId) => {
  return {
    content: groupMsgDTO.Content,
    senderId: groupMsgDTO.Sender,
    receiverId: groupMsgDTO.ReceiverGroup,
    createdAt: groupMsgDTO.CreatedAt,
    isRead: groupMsgDTO.ReadBy?.includes(userId),
    ChannelId: groupMsgDTO.ChannelId,
  }
}

export {
  getAllMsgsMine,
  markMsgsFromOneContactAsRead,
  getAllGroupMsgsMine,
  markMsgsFromOneGroupAsRead,
  mapGroupMsgDTOToMsgGrouped,
  mapGroupContactDTOToGroupContact,
  getAllGroupContactMine,
  mapGroupMsgRspDTOToMsg,
}
