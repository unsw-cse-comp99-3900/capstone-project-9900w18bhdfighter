import { ReactNode, createContext, useContext, useState } from 'react'
import api from '../../api/config'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import {
  AreaDTO,
  UserInfo,
  UserInfoSlim,
  UserInfoSlimDTO,
  UserUpdate,
} from '../../types/user'
import { errHandler } from '../../utils/parse'

interface AccountManagementContextType {
  deleteAccount: (_usrId: number) => Promise<void>
  updateAccount: (_usrId: number, _userUpdate: UserUpdate) => Promise<void>
  createAccount: () => Promise<void>
  getAccountList: () => Promise<void>
  getAnUserProfile: (_usrId: number) => Promise<void>
  currProfileViewing: UserInfo | null
  accountList: UserInfoSlim[]
}
const AccountManagementContext = createContext<AccountManagementContextType>(
  {} as AccountManagementContextType
)

export const useAccountManagementContext = () =>
  useContext(AccountManagementContext)
const AccountManagementContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { msg } = useGlobalComponentsContext()
  const [accountList, setAccountList] = useState<UserInfoSlim[]>([])
  const [currProfileViewing, setCurrProfileViewing] = useState<UserInfo | null>(
    null
  )
  const deleteAccount = async (usrId: number) => {
    try {
      await api.delete(`api/users/${usrId}`)
      msg.success('Delete success')
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const updateAccount = async (usrId: number, userUpdate: UserUpdate) => {
    try {
      await api.put(`api/users/${usrId}`, userUpdate)
      msg.success('Update success')
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const createAccount = async () => {
    //todo: implement create account
  }
  const getAccountList = async () => {
    try {
      const res = await api.get('api/users')

      const _accountList = res.data.data.map((account: UserInfoSlimDTO) => ({
        id: account.UserID,
        firstName: account.FirstName,
        lastName: account.LastName,
        email: account.EmailAddress,
        role: account.UserRole,
      }))
      setAccountList([])
      setAccountList(_accountList)
    } catch (err) {
      console.log(err)

      msg.err('Failed to get account list')
    }
  }
  const getAnUserProfile = async (usrId: number) => {
    try {
      const res = await api.get(`api/users/${usrId}`)
      console.log(res.data)
      setCurrProfileViewing({
        id: res.data.data.UserID,
        firstName: res.data.data.FirstName,
        lastName: res.data.data.LastName,
        email: res.data.data.EmailAddress,
        role: res.data.data.UserRole,
        description: res.data.data.UserInformation,
        interestAreas: res.data.areas.map((area: AreaDTO) => ({
          id: area.AreaID,
          name: area.AreaName,
        })),
      })
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  const ctx = {
    deleteAccount,
    updateAccount,
    createAccount,
    getAccountList,
    getAnUserProfile,
    currProfileViewing,
    accountList,
  }
  return (
    <AccountManagementContext.Provider value={ctx}>
      {children}
    </AccountManagementContext.Provider>
  )
}

export default AccountManagementContextProvider
