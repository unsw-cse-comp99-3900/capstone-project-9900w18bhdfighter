import {
  Group,
  GroupJoinDTO,
  GroupLeaveDTO,
  GroupReqDTO,
  GroupRspDTO,
} from '../types/group'
import { SkillEvalReqDTO, SkillEvalRspDTO } from '../types/skillEval'
import api from './config'
import { mapCourseDTOToCourse } from './courseAPI'
import { mapProjectDTOToProject } from './projectAPI'
import { mapUserSlimProfileDTOUserProfileSlim } from './userAPI'

// post request
const createGroup = async (grp: GroupReqDTO) => {
  return api.post<GroupRspDTO>('api/group_creation/', grp)
}

const joinGroup = async (grp: GroupJoinDTO) => {
  return api.post<GroupJoinDTO[]>('/api/group_join/', grp)
}

const leaveGroup = async (grp: GroupLeaveDTO) => {
  return api.post<GroupLeaveDTO[]>('/api/group_leave/', grp)
}

// get api
const getAllGroups = async () => {
  return api.get<GroupRspDTO[]>('api/groups')
}

const getGroupByProjectId = async (projectId: number | string) => {
  return api.get<GroupRspDTO[]>(`api/groups/projects/${projectId}`)
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
const getAutoCompleteGroups = async (
  groupName: string,
  onlyGroupsWithNoProj = false
) => {
  return api.get<{ data: GroupRspDTO[] }>('api/groups/autocomplete-name', {
    params: {
      name_substring: groupName,
      only_groups_with_no_proj: onlyGroupsWithNoProj,
    },
  })
}
const getGroupListByUserId = async (userId: number) => {
  return api.get<GroupRspDTO[]>(`api/groups/users/${userId}`)
}

const getGroupDetailByGroupId = async (groupId: number) => {
  return api.get<GroupRspDTO>(`api/groups/${groupId}`)
}

const getGroupByCreatorId = async (creatorId: number) => {
  return api.get<GroupRspDTO[]>(`api/groups/creators/${creatorId}`)
}
const updateGroupMeta = async (groupId: number, groupReqDTO: GroupReqDTO) => {
  return api.put<GroupRspDTO>(`api/groups/${groupId}`, groupReqDTO)
}

const createOrUpdateSkillEval = (
  groupId: number | string,
  reqDTO: SkillEvalReqDTO
) => {
  return api.put<SkillEvalRspDTO>(
    `api/groups/${groupId}/preferences/evaluation`,
    reqDTO
  )
}
const getSkillEvalByGroup = (groupId: number | string) => {
  return api.get<SkillEvalRspDTO[]>(
    `api/groups/${groupId}/preferences/evaluation-group`
  )
}
//mapper

const mapGroupPreferenceDTOToGroupPreference = (
  groupPreference: GroupRspDTO
) => {
  return groupPreference.Preferences.map((preference) => {
    return {
      preferenceId: preference.PreferenceID,
      preference: mapProjectDTOToProject(preference.Preference),
      rank: preference.Rank,
      groupId: preference.Group,
    }
  })
}
const mapGroupDTOToGroup: (_groupRspDTO: GroupRspDTO) => Group = (
  groupRspDTO: GroupRspDTO
) => {
  const groupMembers = groupRspDTO.GroupMembers.map(
    mapUserSlimProfileDTOUserProfileSlim
  )
  const groupPreference = mapGroupPreferenceDTOToGroupPreference(groupRspDTO)

  return {
    groupName: groupRspDTO.GroupName,
    groupDescription: groupRspDTO.GroupDescription,
    maxMemberNum: groupRspDTO.MaxMemberNumber,
    groupMembers: groupMembers,
    groupOwner: groupRspDTO.GroupOwner,
    createdBy: groupRspDTO.CreatedBy,
    preferences: groupPreference,
    groupId: groupRspDTO.GroupID,
    course: mapCourseDTOToCourse(groupRspDTO.CourseCode),
  }
}
const mapSkillEvalDTOToSkillEval = (skillEval: SkillEvalRspDTO) => {
  return {
    note: skillEval.Note,
    score: skillEval.Score,
    skill: skillEval.Skill,
  }
}
export {
  assignGroupToProject,
  createGroup,
  createOrUpdateSkillEval,
  getAllGroups,
  getAutoCompleteGroups,
  getGroupByCreatorId,
  getGroupByParticipant,
  getGroupByProjectId,
  getGroupDetailByGroupId,
  getGroupListByUserId,
  getGroupPreferencesById,
  getSkillEvalByGroup,
  joinGroup,
  leaveGroup,
  mapGroupDTOToGroup,
  mapGroupPreferenceDTOToGroupPreference,
  mapSkillEvalDTOToSkillEval,
  removeGroupFromProject,
  updateGroupMeta,
}
