import {
  Contact,
  ContactRspDTO,
  Msg,
  MsgGrouped,
  MsgRspDTO,
} from '../../types/msg'
import { UserProfileSlim, UserProfileSlimDTO } from '../../types/user'

const getAllMessagesMapper: (_data: MsgRspDTO[]) => MsgGrouped = (data) => {
  const groupedMsgs = data.reduce((acc, curr) => {
    if (!acc[curr.ChannelId]) {
      acc[curr.ChannelId] = []
    }
    acc[curr.ChannelId]?.push({
      content: curr.Content,
      senderId: curr.Sender,
      receiverId: curr.Receiver,
      createdAt: curr.CreatedAt,
      isRead: curr.IsRead,
      ChannelId: curr.ChannelId,
    })
    return acc
  }, {} as MsgGrouped)

  return groupedMsgs
}
const getContactsMapper: (_data: ContactRspDTO[]) => Contact[] = (data) => {
  return data.map((contact) => ({
    contactId: contact.ContactID,
    isFixed: contact.IsFixed,
    contact: {
      id: contact.Contact.UserID,
      firstName: contact.Contact.FirstName,
      lastName: contact.Contact.LastName,
      email: contact.Contact.EmailAddress,
      role: contact.Contact.UserRole,
    },
    unreadMsgsCount: contact.UnreadMsgsCount,
  }))
}

const getAutoCompleteContactsMapper: (
  _data: UserProfileSlimDTO[]
) => UserProfileSlim[] = (data) => {
  return data.map((user) => ({
    id: user.UserID,
    firstName: user.FirstName,
    lastName: user.LastName,
    email: user.EmailAddress,
    role: user.UserRole,
  }))
}

const MsgRespDTOMapper: (_msg: MsgRspDTO) => Msg = (msg) => {
  return {
    content: msg.Content,
    senderId: msg.Sender,
    receiverId: msg.Receiver,
    createdAt: msg.CreatedAt,
    isRead: msg.IsRead,
    ChannelId: msg.ChannelId,
  }
}
export {
  getAllMessagesMapper,
  getContactsMapper,
  getAutoCompleteContactsMapper,
  MsgRespDTOMapper,
}
