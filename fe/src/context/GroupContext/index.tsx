import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Group, GroupCreate } from '../../types/group'
import api from '../../api/config'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { errHandler } from '../../utils/parse'
import { useAuthContext } from '../AuthContext'
import { getGroupByParticipant, mapGroupDTOToGroup } from '../../api/groupAPI'

interface GroupContextType {
  createGroup: (_group: GroupCreate) => Promise<void>
  updateGroup: () => void
  deleteGroup: () => void
  getGroupsList: (_id: number) => Promise<void>
  groupList: Group[]
}

const GroupContext = createContext({} as GroupContextType)
export const useGroupContext = () => useContext<GroupContextType>(GroupContext)

const GroupContextProvider = ({ children }: { children: ReactNode }) => {
  const { msg } = useGlobalComponentsContext()
  const [groupList, setGroupList] = useState<Group[]>([])
  const { usrInfo } = useAuthContext()

  const updateGroup = () => {
    //todo: implement update group
  }
  const deleteGroup = () => {
    //todo: implement delete group
  }
  const getGroupsList = async (id: number) => {
    try {
      const res = await getGroupByParticipant(id)
      setGroupList(res.data.map(mapGroupDTOToGroup))
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const createGroup = async (group: GroupCreate) => {
    try {
      await api.post('api/group_creation/', group)
      msg.success('Group created successfully!')
      await getGroupsList(usrInfo?.id as number)
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }

    //todo: implement create group
  }

  useEffect(() => {
    if (!usrInfo) return
    getGroupsList(usrInfo.id)
  }, [usrInfo?.id])
  const ctx = {
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupsList,
    groupList,
  }

  return <GroupContext.Provider value={ctx}>{children}</GroupContext.Provider>
}

export default GroupContextProvider
