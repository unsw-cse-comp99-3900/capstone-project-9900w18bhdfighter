import { Project, ProjectRespDTO } from './proj'
import { UserProfileSlim, UserProfileSlimDTO } from './user'

interface GroupPreferenceDTO {
  PreferenceID: number
  Preference: ProjectRespDTO
  Rank: number
}
interface GroupPreference {
  preferenceId: number
  preference: Project
  rank: number
}

interface GroupRspDTO {
  GroupID: number
  GroupName: string
  GroupDescription: string
  MaxMemberNum: number
  GroupMembers: UserProfileSlimDTO[]
  GroupOwner: string
  CreatedBy: number
  Preferences: GroupPreferenceDTO[]
}

interface Group {
  groupId: number
  groupName: string
  groupDescription: string
  maxMemberNum: number
  groupMembers: UserProfileSlim[]
  groupOwner: string
  createdBy: number
  preferences: GroupPreference[]
}

export { GroupRspDTO, Group, GroupPreferenceDTO }
