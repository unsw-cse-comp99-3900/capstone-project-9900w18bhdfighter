import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { UserProfileSlim, UserProfileSlimDTO } from '../../types/user'
import api from '../../api/config'
import { errHandler } from '../../utils/parse'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { useAuthContext } from '../AuthContext'

interface MessageContextType {
  getAutoCompleteContacts: (_email: string) => Promise<void>
  currAutoCompleteContacts: UserProfileSlim[]
  setCurrAutoCompleteContacts: React.Dispatch<
    React.SetStateAction<UserProfileSlim[]>
  >
  socketRef: React.MutableRefObject<WebSocket | null>
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
  const { msg } = useGlobalComponentsContext()
  const socketRef = useRef<WebSocket | null>(null)
  const { usrInfo } = useAuthContext()
  const id = usrInfo?.id
  useEffect(() => {
    if (!id) return
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/user/${id}`)
    socketRef.current = socket
    socket.onopen = () => {
      console.log('Connected to the chat server')
    }
    socket.onmessage = (event) => {
      console.log('Message from server: ', event.data)
    }
    return () => {
      socket.close()
    }
  }, [id])

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

  const ctx = {
    getAutoCompleteContacts,
    currAutoCompleteContacts,
    setCurrAutoCompleteContacts,
    socketRef,
  }

  return (
    <MessageContext.Provider value={ctx}>{children}</MessageContext.Provider>
  )
}

export default MessageContextProvider
