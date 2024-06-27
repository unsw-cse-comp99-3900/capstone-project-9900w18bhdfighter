import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { UserInfo, UserLogin, UserSignup } from '../../types/user'
import api from '../../api/config'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { AxiosError, isAxiosError } from 'axios'

import route from '../../constant/route'
import type { NavigateFunction } from 'react-router-dom'
import { role } from '../../constant/role'

interface AuthContextType {
  usrInfo: UserInfo | null
  login: (_user: UserLogin, _navigate: NavigateFunction) => void
  logout: (_navigate: NavigateFunction) => void
  signup: (_user: UserSignup, _navigate: NavigateFunction) => void
  haveLoggedIn: () => boolean
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>
}
const GlobalAuthContext = createContext({} as AuthContextType)
export const useAuthContext = () => useContext(GlobalAuthContext)

type Props = {
  children: ReactNode
}
const AuthContextProvider = ({ children }: Props) => {
  //todo: implement auth context
  const { msg } = useGlobalComponentsContext()
  const [usrInfo, setUserInfo] = useState<UserInfo | null>(null)
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('user_info')
    if (token && userInfo) {
      setUserInfo(JSON.parse(userInfo))
    }
  }, [])

  const login = async (user: UserLogin, navigate: NavigateFunction) => {
    try {
      const res = await api.post('login/', user)
      const _usrInfo = {
        id: res.data.user_profile.UserID,
        firstName: res.data.user_profile.FirstName,
        lastName: res.data.user_profile.LastName,
        email: res.data.user_profile.EmailAddress,
        role: role.STUDENT,
      }
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user_info', JSON.stringify(_usrInfo))
      setUserInfo(_usrInfo)
      msg.success('Login success')
      navigate(route.DASHBOARD)
    } catch (err) {
      console.log(err)

      if (isAxiosError(err)) {
        const error = err as AxiosError<{ error: string }>
        const data = error.response?.data
        if (data) {
          msg.err(data.error)
        }
      } else {
        msg.err('Something went wrong')
      }
    }
  }
  const logout = (navigate: NavigateFunction) => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_info')
    setUserInfo(null)
    msg.info('Logout success')
    navigate(route.ROOT)
  }

  const signup = async (user: UserSignup, navigate: NavigateFunction) => {
    try {
      const res = await api.post('/student_signup/', user)
      const _usrInfo = {
        id: res.data.user.UserID,
        firstName: res.data.user.FirstName,
        lastName: res.data.user.LastName,
        email: res.data.user.EmailAddress,
        role: role.STUDENT,
      }
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user_info', JSON.stringify(_usrInfo))

      setUserInfo(_usrInfo)
      msg.success('Signup success')
      navigate(route.DASHBOARD)
    } catch (err) {
      if (isAxiosError(err)) {
        const error = err as AxiosError<{ error: string }>
        const data = error.response?.data
        if (data) {
          msg.err(data.error)
        }
      }
    }
  }
  const haveLoggedIn = () => {
    return !!localStorage.getItem('token')
  }

  const ctx = {
    usrInfo,
    setUserInfo,
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
