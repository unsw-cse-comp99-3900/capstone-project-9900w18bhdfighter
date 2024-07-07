import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { UserProfileSlim, UserProfileSlimDTO } from '../../types/user'
import api from '../../api/config'
import {
  channel_id_to_ids,
  errHandler,
  ids_to_channel_id,
} from '../../utils/parse'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { useAuthContext } from '../AuthContext'
import { useParams } from 'react-router-dom'
import {
  Contact,
  ContactPostDTO,
  ContactRspDTO,
  ContactUpdateDTO,
  Conversation,
  Msg,
  MsgGrouped,
  MsgRspDTO,
  MsgWSRspDTO,
} from '../../types/msg'
type RouteParams = {
  receiverId: string
  type: string
}
interface MessageContextType {
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
}

const MessageContext = createContext({} as MessageContextType)
export const useMessageContext = () => useContext(MessageContext)

type Props = {
  children: ReactNode
}

export const MessageContextProvider = ({ children }: Props) => {
  const [currAutoCompleteContacts, setCurrAutoCompleteContacts] = useState<
    UserProfileSlim[]
  >([])
  const [contactList, setContactList] = useState<Contact[] | null>(null)
  // const [groupContactList, setGroupContactList] = useState<Contact[] | null>(
  //   null
  // )
  const [msgMap, setMsgMap] = useState<MsgGrouped>({})
  const { msg } = useGlobalComponentsContext()
  const socketRef = useRef<WebSocket | null>(null)
  const { usrInfo } = useAuthContext()
  const id = usrInfo?.id
  const params = useParams<RouteParams>()

  //currConversation is a contact with messages
  const currConversation = useMemo(() => {
    if (!contactList || !params.receiverId || !id) return null
    const currContact = contactList.find(
      (contact) => contact.contact.id === Number(params.receiverId)
    )
    if (!currContact) return null

    const channelKey = ids_to_channel_id([id, currContact.contact.id])
    return {
      ...currContact,
      messages: msgMap[channelKey] || [],
    }
  }, [contactList, params.receiverId, msgMap, id])

  const contactsDiff = useMemo(() => {
    if (!contactList || !id) {
      //if contactList is not ready or id is not ready, return empty array
      return []
    }
    const contactIds = contactList.map((contact) => contact.contact.id).sort()
    const channelKeys = Object.keys(msgMap)
    const currChannelKeys = contactIds.map((contact_id) =>
      ids_to_channel_id([id, contact_id])
    )
    //return the difference between channelKeys and currChannelKeys
    const res = channelKeys.filter((key) => !currChannelKeys.includes(key))
    //return the unique values
    return Array.from(new Set(res))
  }, [contactList, msgMap, id])

  const getAutoCompleteContacts = async (email: string) => {
    try {
      const res = await api.get<{ data: UserProfileSlimDTO[] }>(
        'api/users/autocomplete-email',
        {
          params: {
            email_substring: email,
          },
        }
      )
      setCurrAutoCompleteContacts(
        res.data.data.map((user) => ({
          id: user.UserID,
          firstName: user.FirstName,
          lastName: user.LastName,
          email: user.EmailAddress,
          role: user.UserRole,
        }))
      )
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
      const res = await api.get<{
        data: ContactRspDTO[]
      }>('api/contacts')
      setContactList(
        res.data.data.map((contact) => ({
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
      )
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
      await api.post<
        ContactPostDTO & {
          ContactUser: number
        }
      >('api/contacts', {
        ...postDto,
        ContactUser: id,
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
      const res = await api.get<MsgRspDTO[]>('api/messages')
      const groupedMsgs = res.data.reduce((acc, curr) => {
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
      await api.put(`api/messages/mark-as-read/${senderId}`)
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  //get all messages
  useEffect(() => {
    getAllMessages()
  }, [])
  //init socket when id is ready
  useEffect(() => {
    if (!id) return
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/user/${id}`)
    socketRef.current = socket
    console.log('connecting to chat server')

    socket.onopen = () => {
      console.log('Connected to the chat server')
    }
    socket.onmessage = (event) => {
      const res = JSON.parse(event.data) as MsgWSRspDTO

      if (res.status_code === 201) {
        // a msg is sent
      }
      // a msg is received or a msg is sent
      if (res.status_code >= 200 && res.status_code < 300) {
        const msgDto = res.data as MsgRspDTO
        const new_msg = {
          content: msgDto.Content,
          senderId: msgDto.Sender,
          receiverId: msgDto.Receiver,
          createdAt: msgDto.CreatedAt,
          isRead: msgDto.IsRead,
          ChannelId: msgDto.ChannelId,
        }
        setMsgMap((prev) => {
          const key = new_msg.ChannelId
          const updatedMap = { ...prev }
          if (!updatedMap[key]) {
            updatedMap[key] = []
          }
          updatedMap[key] = [...(updatedMap[key] as Msg[]), new_msg]
          return updatedMap
        })
        // if new_msg is not read, increment unreadMsgsCount
        if (new_msg.isRead === false) {
          setContactList((prev) => {
            if (!prev) return prev
            const updatedList = prev.map((contact) => {
              if (contact.contact.id === new_msg.senderId) {
                return {
                  ...contact,
                  unreadMsgsCount: contact.unreadMsgsCount + 1,
                }
              }
              return contact
            })
            return updatedList
          })
        }
      } else if (res.status_code >= 400) {
        msg.err(res.message)
      } else {
        msg.err('Unknown error')
      }
    }
    return () => {
      console.log('closing socket')
      socketRef.current?.close()
      socketRef.current = null
    }
  }, [id])
  //send currWindow to server
  useEffect(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return

    socketRef.current.send(
      JSON.stringify({ currWindow: params.receiverId || -1 })
    )
  }, [params.receiverId])

  //mark as read when conversation is opened
  useEffect(() => {
    if (!params.receiverId) return
    if (!currConversation) return
    const todo = async () => {
      console.log('mark as read')
      await markAsRead(Number(params.receiverId))
      await getContacts()
    }
    if (currConversation?.unreadMsgsCount > 0) todo()
  }, [params.receiverId, currConversation])
  // if someone not in contactList but in msgMap, add to contactList
  useEffect(() => {
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
  }, [contactsDiff.length])

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
  }

  return (
    <MessageContext.Provider value={ctx}>{children}</MessageContext.Provider>
  )
}

export default MessageContextProvider
