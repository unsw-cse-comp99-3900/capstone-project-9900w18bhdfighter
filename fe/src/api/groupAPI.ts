import {
  Group,
  GroupRspDTO,
  GroupReqDTO,
  GroupJoinDTO,
  GroupLeaveDTO,
} from '../types/group'
import api from './config'
import { mapProjectDTOToProject } from './projectAPI'
import { mapUserSlimProfileDTOUserProfileSlim } from './userAPI'

// post request
const createGroup = async (grp: GroupReqDTO) => {
  return api.post<GroupRspDTO>('group_creation/', grp)
}

const joinGroup = async (grp: GroupJoinDTO) => {
  return api.post<GroupJoinDTO[]>('/group_join/', grp)
}

const leaveGroup = async (grp: GroupLeaveDTO) => {
  return api.post<GroupLeaveDTO[]>('/group_leave/', grp)
}

// get api
const getAllGroups = async () => {
  return api.get<GroupRspDTO[]>('groups')
}

const getGroupByProjectId = async (projectId: number | string) => {
  return api.get<GroupRspDTO[]>(`groups/${projectId}`)
}

const getGroupByParticipant = async (groupId: string | number) => {
  return api.get<GroupRspDTO[]>(`api/groups/users/${groupId}`)
}
const getGroupPreferencesById = async (groupId: string | number) => {
  return api.get<GroupRspDTO[]>(`api/groups/${groupId}/preferences/`)
}

const assignGroupToProject = async (data: {
  GroupID: number
  ProjectID: number
}) => {
  return api.post('api/group-projects', data)
}
const removeGroupFromProject = async (projectId: number, groupId: number) => {
  console.log(`api/group-projects/${projectId}/${groupId}/`)

  return api.delete(`api/group-projects/${projectId}/${groupId}/`)
}

// const removeMemberFromGroup = async (userId: number, groupId: number) => {
//   console.log(`/group_leave/${userId}/${groupId}/`)

//   return api.delete(`/group_leave/${userId}/${groupId}/`)
// }

const getAutoCompleteGroups = async (groupName: string) => {
  return api.get<{ data: GroupRspDTO[] }>('api/groups/autocomplete-name', {
    params: {
      name_substring: groupName,
    },
  })
}
const getGroupListByUserId = async (userId: number) => {
  return api.get<GroupRspDTO[]>(`api/groups/users/${userId}`)
}

const getGroupDetailByGroupId = async (groupId: number) => {
  return api.get<GroupRspDTO>(`api/groups/${groupId}`)
}

//mapper
const mapGroupDTOToGroup: (_groupRspDTO: GroupRspDTO) => Group = (
  groupRspDTO: GroupRspDTO
) => {
  const groupMembers = groupRspDTO.GroupMembers.map(
    mapUserSlimProfileDTOUserProfileSlim
  )
  const groupPreference = groupRspDTO.Preferences.map((preference) => {
    return {
      preferenceId: preference.PreferenceID,
      preference: mapProjectDTOToProject(preference.Preference),
      rank: preference.Rank,
      lock: preference.Lock,
      groupId: preference.Group,
    }
  })

  return {
    groupName: groupRspDTO.GroupName,
    groupDescription: groupRspDTO.GroupDescription,
    maxMemberNum: groupRspDTO.MaxMemberNumber,
    groupMembers: groupMembers,
    groupOwner: groupRspDTO.GroupOwner,
    createdBy: groupRspDTO.CreatedBy,
    preferences: groupPreference,
    groupId: groupRspDTO.GroupID,
  }
}

export {
  getAllGroups,
  mapGroupDTOToGroup,
  getGroupByProjectId,
  assignGroupToProject,
  removeGroupFromProject,
  getAutoCompleteGroups,
  getGroupByParticipant,
  createGroup,
  getGroupPreferencesById,
  joinGroup,
  leaveGroup,
  getGroupListByUserId,
  getGroupDetailByGroupId,
}
