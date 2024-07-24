import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { UserProfileSlim } from '../../types/user'
import api from '../../api/config'
import { channel_id_to_ids, errHandler } from '../../utils/parse'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { useAuthContext } from '../AuthContext'
import { useLocation, useParams } from 'react-router-dom'
import {
  Contact,
  ContactPostDTO,
  ContactUpdateDTO,
  Conversation,
  GroupContact,
  GroupConversation,
  MsgGrouped,
  WSMsgReqDTO,
} from '../../types/msg'
import {
  getMyContactList,
  getAutoCompleteContacts as getACC,
  addOneContact,
} from '../../api/contactAPI'
import {
  getAllGroupContactMine,
  getAllGroupMsgsMine,
  getAllMsgsMine,
  mapGroupContactDTOToGroupContact,
  mapGroupMsgDTOToMsgGrouped,
  markMsgsFromOneContactAsRead,
  markMsgsFromOneGroupAsRead,
} from '../../api/msgAPI'
import {
  getAllMessagesMapper,
  getAutoCompleteContactsMapper,
  getContactsMapper,
} from './mapper'
import useCurrConversation from './hooks/useCurrConversation'
import useCurrGroupConversation from './hooks/useGroupConversation'
import useContactsDiff from './hooks/useContactsDiff'
import useChatSocket from './hooks/useChatSocket'
type RouteParams = {
  receiverId: string
  type: 'group' | 'user'
}
export interface MessageContextType {
  getAutoCompleteContacts: (_email: string) => Promise<void>
  currAutoCompleteContacts: UserProfileSlim[]
  setCurrAutoCompleteContacts: React.Dispatch<
    React.SetStateAction<UserProfileSlim[]>
  >
  socketRef: React.MutableRefObject<WebSocket | null>
  getContacts: () => Promise<void>
  updateContact: (
    _contactId: number,
    _updateDto: ContactUpdateDTO
  ) => Promise<void>
  addContact: (_postDto: ContactPostDTO) => Promise<void>
  params: Readonly<Partial<RouteParams>>
  contactList: Contact[] | null
  currConversation: Conversation | null
  groupContactList: GroupContact[] | null
  currGroupConversation: GroupConversation | null
  conversationType: 'group' | 'user' | undefined
  groupMsgMap: MsgGrouped | null
  msgMap: MsgGrouped | null
  sendWSMsg: (_data: WSMsgReqDTO) => void
  setGroupContactList: React.Dispatch<
    React.SetStateAction<GroupContact[] | null>
  >
  unreadMsgs: number
  getAllGroupContacts: () => Promise<void>
}

const MessageContext = createContext({} as MessageContextType)
export const useMessageContext = () => useContext(MessageContext)

type Props = {
  children: ReactNode
  msgRoute: string
}

export const MessageContextProvider = ({ children, msgRoute }: Props) => {
  const [currAutoCompleteContacts, setCurrAutoCompleteContacts] = useState<
    UserProfileSlim[]
  >([])
  const [contactList, setContactList] = useState<Contact[] | null>(null)
  const [groupContactList, setGroupContactList] = useState<
    GroupContact[] | null
  >(null)
  const [msgMap, setMsgMap] = useState<MsgGrouped | null>(null)
  const [groupMsgMap, setGroupMsgMap] = useState<MsgGrouped | null>(null)
  const { msg } = useGlobalComponentsContext()
  const { usrInfo } = useAuthContext()
  const socketRef = useChatSocket({
    id: usrInfo?.id,
    setMsgMap,
    setContactList,
    msg,
    setGroupMsgMap,
    setGroupContactList,
  })
  const id = usrInfo?.id
  const params = useParams<RouteParams>()
  const unreadGroupMsgs =
    contactList?.reduce((acc, contact) => acc + contact.unreadMsgsCount, 0) || 0
  const unreadUserMsgs =
    groupContactList?.reduce(
      (acc, groupContact) => acc + groupContact.unreadMsgsCount,
      0
    ) || 0
  const unreadMsgs = unreadGroupMsgs + unreadUserMsgs
  const location = useLocation()
  const [isLeaveMsgPage, setIsLeaveMsgPage] = useState(false)
  //currConversation is a contact with messages
  const currConversation = useCurrConversation({
    contactList,
    receiverId: params.receiverId,
    msgMap,
    id: id,
    type: params.type,
  })

  //currGroupConversation is a group with messages
  const currGroupConversation = useCurrGroupConversation({
    groupsList: groupContactList,
    receiverId: params.receiverId,
    msgMap: groupMsgMap,
    id: id as number,
    type: params.type,
  })

  const contactsDiff = useContactsDiff({
    contactList,
    msgMap,
    id,
  })

  const getAutoCompleteContacts = async (email: string) => {
    try {
      const res = await getACC(email)
      setCurrAutoCompleteContacts(getAutoCompleteContactsMapper(res.data.data))
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const getContacts = async () => {
    try {
      const res = await getMyContactList()
      setContactList(getContactsMapper(res.data.data).sort())
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const updateContact = async (
    contactId: number,
    contactUpdateDto: ContactUpdateDTO
  ) => {
    try {
      await api.put<ContactUpdateDTO>(
        `api/contacts/${contactId}`,
        contactUpdateDto
      )
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const addContact = async (postDto: ContactPostDTO, info = true) => {
    try {
      await addOneContact({
        ...postDto,
        ContactUser: id as number,
      })
      info && msg.success('Contact added')
    } catch (err) {
      errHandler(
        err,
        () => msg.err('Failed to add contact.'),
        (str) => msg.err(str)
      )
    }
  }
  const getAllMessages = async () => {
    try {
      const res = await getAllMsgsMine()
      const groupedMsgs = getAllMessagesMapper(res.data)
      setMsgMap(groupedMsgs)
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const markAsRead = async (senderId: number) => {
    try {
      await markMsgsFromOneContactAsRead(senderId)
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const markAsReadGroup = async (groupId: number) => {
    try {
      await markMsgsFromOneGroupAsRead(groupId)
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const getAllGroupContacts = async () => {
    if (!id) return
    try {
      const res = await getAllGroupContactMine()
      setGroupContactList(
        res.data.data.map((groupContact) =>
          mapGroupContactDTOToGroupContact(groupContact)
        )
      )
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const getAllGroupMsgs = async () => {
    if (!id) return
    try {
      const res = await getAllGroupMsgsMine()
      setGroupMsgMap(mapGroupMsgDTOToMsgGrouped(res.data.data, id))
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const sendWSMsg = (data: WSMsgReqDTO) => {
    try {
      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        throw new Error('WebSocket is not open')
      }

      socketRef.current.send(JSON.stringify(data))
    } catch (err) {
      msg.err('Lost connection to server.')
    }
  }
  //handle user messages
  useEffect(() => {
    getContacts()
    getAllMessages()
  }, [])
  //handle group messages
  useEffect(() => {
    getAllGroupContacts()
    getAllGroupMsgs()
  }, [id])
  //add contact if receiverId is in params but not in contactList
  useEffect(() => {
    if (!contactList) return
    if (!params.receiverId) return
    console.log(contactList)

    if (
      !contactList.find(
        (contact) => contact.contact.id === Number(params.receiverId)
      )
    ) {
      addContact({ Contact: Number(params.receiverId) }, false).then(() =>
        getContacts()
      )
    }
  }, [JSON.stringify(contactList)])

  //send currWindow to server
  useEffect(() => {
    if (!params.receiverId || !params.type) return
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return

    sendWSMsg({
      type: params.type,
      currWindow: parseInt(params.receiverId),
      action: 'CHANGE_WINDOW',
    })
  }, [params, socketRef.current])

  //set isLeaveMsgPage
  useEffect(() => {
    if (!location.pathname.includes(msgRoute)) setIsLeaveMsgPage(true)
    else setIsLeaveMsgPage(false)
    console.log(location.pathname)
  }, [location])
  //send leave msg to server when leaving msg page
  useEffect(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return
    if (isLeaveMsgPage) {
      sendWSMsg({
        action: 'LEAVE',
      })
    }
  }, [isLeaveMsgPage, socketRef.current])
  //mark as read when conversation is opened
  useEffect(() => {
    if (!params.receiverId) return
    if (!currConversation) return
    const todo = async () => {
      await markAsRead(Number(params.receiverId))
      await getContacts()
    }

    if (currConversation?.unreadMsgsCount > 0) todo()
  }, [params, currConversation])

  //mark as read when group conversation is opened
  useEffect(() => {
    if (!params.receiverId) return
    if (!currGroupConversation) return
    const todoGroup = async () => {
      await markAsReadGroup(Number(params.receiverId))
      await getAllGroupContacts()
    }
    if (currGroupConversation?.unreadMsgsCount > 0) todoGroup()
  }, [params.receiverId, currGroupConversation])

  // if someone not in contactList but in msgMap, add to contactList
  useEffect(() => {
    if (!contactsDiff) return
    //add contact
    const todo = async () => {
      await Promise.all(
        contactsDiff.map((channel_id) => {
          const [id1, id2] = channel_id_to_ids(channel_id)
          const contactId = id1 === id ? id2 : id1
          return addContact({ Contact: contactId }, false)
        })
      )
      await getContacts()
    }
    todo()
  }, [JSON.stringify(contactsDiff)])

  const ctx = {
    getAutoCompleteContacts,
    currAutoCompleteContacts,
    setCurrAutoCompleteContacts,
    getContacts,
    socketRef,
    updateContact,
    addContact,
    params,
    contactList,
    currConversation,
    msgMap,
    currGroupConversation,
    conversationType: params.type,
    groupMsgMap,
    sendWSMsg,
    setGroupContactList,
    groupContactList,
    markAsReadGroup,
    unreadMsgs,
    getAllGroupContacts,
  }

  return (
    <MessageContext.Provider value={ctx}>{children}</MessageContext.Provider>
  )
}

export default MessageContextProvider
