import { GroupPreferenceReqDTO } from '../types/group'
import api from './config'

const updateGroupPreference = async (
  data: GroupPreferenceReqDTO[],
  groupId: string | number
) => {
  return api.put(`api/groups/${groupId}/preferences`, data)
}

const lockGroupPreference = async (groupId: string | number) => {
  return api.put(`api/groups/${groupId}/preferences/submit`)
}

export { updateGroupPreference, lockGroupPreference }
