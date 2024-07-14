import { ReactNode, createContext, useContext } from 'react'
import { GroupCreate } from '../../types/grp'
import api from '../../api/config'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { isAxiosError } from 'axios'

interface GroupContextType {
  createGroup: (_group: GroupCreate) => void
  updateGroup: () => void
  deleteGroup: () => void
  getGroupsList: () => void
}

const GroupContext = createContext({} as GroupContextType)
export const useGroupContext = () => useContext<GroupContextType>(GroupContext)

const GroupContextProvider = ({ children }: { children: ReactNode }) => {
  const { msg } = useGlobalComponentsContext()
  const createGroup = async (group: GroupCreate) => {
    try {
      const res = await api.post('group_creation/', group)
      msg.success('Group created successfully!')
      console.log(res)
    } catch (err) {
      if (isAxiosError(err)) {
        msg.err(err.response?.data.error)
      } else {
        msg.err('Something went wrong')
      }
    }

    //todo: implement create project
  }
  const updateGroup = () => {
    //todo: implement update project
  }
  const deleteGroup = () => {
    //todo: implement delete project
  }
  const getGroupsList = () => {
    //todo: implement get projects list
  }

  const ctx = {
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupsList,
  }

  return <GroupContext.Provider value={ctx}>{children}</GroupContext.Provider>
}

export default GroupContextProvider
