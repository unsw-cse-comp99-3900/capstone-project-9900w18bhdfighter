import { Group, GroupRspDTO } from './group'
import { UserProfileSlim, UserProfileSlimDTO } from './user'

interface MsgReqDTO {
  content: string
  receiverId: number
}
interface MsgWSRspDTO {
  status_code: number
  message: string
  data?: MsgRspDTO
}

interface Contact {
  contactId: number
  contact: UserProfileSlim
  isFixed: boolean
  unreadMsgsCount: number
}

interface Conversation extends Contact {
  messages: Msg[]
}
interface GroupConversation extends Group {
  messages: Msg[]
}
interface ContactReqDTO {
  Contact: number
  ContactUser: number
}

interface ContactUpdateDTO {
  IsFixed: boolean
}
interface ContactPostDTO {
  Contact: number
  IsFixed?: boolean
}
interface ContactRspDTO {
  ContactID: number
  Contact: UserProfileSlimDTO
  ContactUser: number
  IsFixed: boolean
  UnreadMsgsCount: number
}
interface MsgRspDTO {
  Content: string
  MessageId: number
  Sender: number
  Receiver: number
  CreatedAt: string
  IsRead: boolean
  ChannelId: string
}
interface Msg {
  content: string
  senderId: number
  receiverId: number
  createdAt: string
  isRead: boolean
  ChannelId: string
}

interface MsgGrouped {
  [key: string]: Msg[]
}
interface GroupContact extends Group {
  unreadMsgsCount: number
}
interface GroupContactRspDTO extends GroupRspDTO {
  UnreadMsgsCount: number
}
interface GroupMsgDTO {
  GroupMessageID: number
  Content: string
  Sender: number
  ReceiverGroup: number
  CreatedAt: string
  ReadBy: number[]
  ChannelId: string
}
interface GroupMsg {
  content: string
  senderId: number
  receiverGroupId: number
  createdAt: string
  readBy: number[]
  ChannelId: string
}

interface WSMsgReqDTO {
  action: 'CHANGE_WINDOW' | 'NEW_MESSAGE' | 'LEAVE'
  type?: 'user' | 'group'
  currWindow?: number
  payload?: MsgReqDTO
}

interface WSMsgRspDTO {
  status_code: number
  message: string
  type: 'user' | 'group'
  data: MsgRspDTO | GroupMsgDTO
}

export {
  Msg,
  MsgReqDTO,
  MsgRspDTO,
  Contact,
  ContactReqDTO,
  ContactRspDTO,
  ContactUpdateDTO,
  ContactPostDTO,
  MsgGrouped,
  Conversation,
  MsgWSRspDTO,
  GroupContact,
  GroupMsg,
  GroupMsgDTO,
  GroupConversation,
  WSMsgReqDTO,
  WSMsgRspDTO,
  GroupContactRspDTO,
}
