import { ReactNode, createContext, useContext, useState } from 'react'
import { UserProfileSlim, UserProfileSlimDTO } from '../../types/user'
import api from '../../api/config'
import { errHandler } from '../../utils/parse'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'

interface MessageContextType {
  getAutoCompleteContacts: (_email: string) => Promise<void>
  currAutoCompleteContacts: UserProfileSlim[]
  setCurrAutoCompleteContacts: React.Dispatch<
    React.SetStateAction<UserProfileSlim[]>
  >
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
  }

  return (
    <MessageContext.Provider value={ctx}>{children}</MessageContext.Provider>
  )
}

export default MessageContextProvider
