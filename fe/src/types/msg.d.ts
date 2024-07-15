import { Group } from './group'
import { UserProfileSlim, UserProfileSlimDTO } from './user'

interface MsgReqDTO {
  type: 'user' | 'group'
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
interface GroupContact {
  groupId: number
  members: UserProfileSlim[]
  unreadMsgsCount: number
  msg: GroupMsg
}
interface GroupMsgDTO {
  GroupMessageID: number
  Content: string
  Sender: number
  ReceiverGroup: number
  CreatedAt: string
  ReadBy: number[]
}
interface GroupMsg {
  content: string
  senderId: number
  receiverGroupId: number
  createdAt: string
  readBy: number[]
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
}
