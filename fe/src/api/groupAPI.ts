import { Group, GroupRspDTO } from '../types/group'
import api from './config'
import { mapProjectDTOToProject } from './projectAPI'
import { mapUserSlimProfileDTOUserProfileSlim } from './userAPI'

const getAllGroups = async () => {
  return api.get<GroupRspDTO[]>('groups')
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
    }
  })

  return {
    groupName: groupRspDTO.GroupName,
    groupDescription: groupRspDTO.GroupDescription,
    maxMemberNum: groupRspDTO.MaxMemberNum,
    groupMembers: groupMembers,
    groupOwner: groupRspDTO.GroupOwner,
    createdBy: groupRspDTO.CreatedBy,
    preferences: groupPreference,
  }
}

export { getAllGroups, mapGroupDTOToGroup }
