import { ReactNode, createContext, useContext, useState } from 'react'
import type { UserInfo, UserSignup } from '../../types/user'
import api from '../../api/config'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'

interface AuthContextType {
  usrInfo: UserInfo | null
  login: () => void
  logout: () => void
  signup: (_user: UserSignup) => void
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
  const { msg } = useGlobalComponentsContext()
  const login = () => {
    //todo: implement login
  }
  const logout = () => {
    //todo: implement logout
  }
  const signup = async (user: UserSignup) => {
    try {
      const res = await api.post('/student_signup', user)
      console.log(res.data)

      msg.success('Signup success')
    } catch (err) {
      msg.err('Signup failed')
    }
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
