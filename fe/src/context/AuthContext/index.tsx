import { ReactNode, createContext, useContext, useState } from 'react'
import type { UserInfo } from '../../types/user'

interface AuthContextType {
  usrInfo: UserInfo | null
  login: () => void
  logout: () => void
  signup: () => void
  haveLoggedIn: () => boolean
}
const GlobalAuthContext = createContext({} as AuthContextType)
export const useAuthContext = () => useContext(GlobalAuthContext)

type Props = {
  children: ReactNode
}
const AuthContextProvider = ({ children }: Props) => {
  //todo: implement auth context
  const [usrInfo] = useState<UserInfo | null>(null)

  const login = () => {
    //todo: implement login
  }
  const logout = () => {
    //todo: implement logout
  }
  const signup = () => {
    //todo: implement signup
  }
  const haveLoggedIn = () => {
    return !!usrInfo
  }

  const ctx = {
    usrInfo,
    login,
    logout,
    signup,
    haveLoggedIn,
  }
  return (
    <GlobalAuthContext.Provider value={ctx}>
      {children}
    </GlobalAuthContext.Provider>
  )
}

export default AuthContextProvider
