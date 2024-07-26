import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import api from '../../api/config'
import {
  createTimeRule,
  deleteTimeRule,
  updateTimeRule,
} from '../../api/timeRuleAPI'
import { getUserById, mapUserProfileDTOToUserInfo } from '../../api/userAPI'
import { TimeRule, TimeRuleReqDTO } from '../../types/timeRule'
import { UserInfo, UserProfileDTO, UserUpdate } from '../../types/user'
import { errHandler } from '../../utils/parse'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { useGlobalConstantContext } from '../GlobalConstantContext'

interface ManagementContextType {
  deleteAccount: (_usrId: number) => Promise<void>
  updateAccount: (_usrId: number, _userUpdate: UserUpdate) => Promise<void>
  createAccount: () => Promise<void>
  getAccountList: () => Promise<void>
  getAnUserProfile: (_usrId: number) => Promise<void>
  currProfileViewing: UserInfo | null
  accountList: UserInfo[]
  timeRules: TimeRule[] | null
  fetchTimeRules: () => Promise<void>
  delTimeRule: (_id: number | string) => Promise<void>
  addTimeRule: (_timeRule: TimeRuleReqDTO) => Promise<void>

  enableTimeRule: (_id: number | string) => Promise<void>
}
const ManagementContext = createContext<ManagementContextType>(
  {} as ManagementContextType
)

export const useManagementContext = () => useContext(ManagementContext)
const ManagementContextProvider = ({ children }: { children: ReactNode }) => {
  const { msg } = useGlobalComponentsContext()
  const [accountList, setAccountList] = useState<UserInfo[]>([])
  const [currProfileViewing, setCurrProfileViewing] = useState<UserInfo | null>(
    null
  )
  const { fetchTimeRules, timeRules } = useGlobalConstantContext()
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
      console.log(res.data)

      const _accountList: UserInfo[] = res.data.data.map(
        (account: UserProfileDTO) => ({
          id: account.UserID,
          firstName: account.FirstName,
          lastName: account.LastName,
          email: account.EmailAddress,
          role: account.UserRole,
          description: account.UserInformation,
          interestAreas: account.Areas.map((area) => ({
            id: area.AreaID,
            name: area.AreaName,
          })),
          courseCode: {
            id: account.CourseCode?.CourseCodeID,
            name: account.CourseCode?.CourseName,
          },
        })
      )
      setAccountList(_accountList)
    } catch (err) {
      msg.err('Failed to get account list')
    }
  }
  const getAnUserProfile = async (usrId: number) => {
    try {
      const res = await getUserById(usrId)
      setCurrProfileViewing(mapUserProfileDTOToUserInfo(res.data.data))
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  const delTimeRule = async (id: number | string) => {
    try {
      await deleteTimeRule(id)
      await fetchTimeRules()
      msg.success('Delete success')
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const addTimeRule = async (timeRule: TimeRuleReqDTO) => {
    try {
      await createTimeRule(timeRule)
      await fetchTimeRules()
      msg.success('Add success')
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const enableTimeRule = async (id: number | string) => {
    try {
      await updateTimeRule(id, true)
      await fetchTimeRules()
      msg.success('Enable success')
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  useEffect(() => {
    getAccountList()
    fetchTimeRules()
  }, [])
  const ctx = {
    deleteAccount,
    updateAccount,
    createAccount,
    getAccountList,
    getAnUserProfile,
    currProfileViewing,
    fetchTimeRules,
    accountList,
    timeRules,
    delTimeRule,
    addTimeRule,
    enableTimeRule,
  }
  return (
    <ManagementContext.Provider value={ctx}>
      {children}
    </ManagementContext.Provider>
  )
}

export default ManagementContextProvider
