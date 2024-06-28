import { ReactNode, createContext, useContext } from 'react'

interface AccountManagementContextType {
  deleteAccount: () => void
  updateAccount: () => void
  createAccount: () => void
  getAccountList: () => void
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
  const deleteAccount = () => {
    //todo: implement delete account
  }
  const updateAccount = () => {
    //todo: implement update account
  }
  const createAccount = () => {
    //todo: implement create account
  }
  const getAccountList = () => {
    //todo: implement get account list
  }

  const ctx = {
    deleteAccount,
    updateAccount,
    createAccount,
    getAccountList,
  }
  return (
    <AccountManagementContext.Provider value={ctx}>
      {children}
    </AccountManagementContext.Provider>
  )
}

export default AccountManagementContextProvider
