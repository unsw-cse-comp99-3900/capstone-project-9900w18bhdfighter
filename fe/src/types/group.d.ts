import { Project, ProjectRespDTO } from './proj'
import { UserProfileSlim, UserProfileSlimDTO } from './user'

interface GroupPreferenceDTO {
  PreferenceID: number
  Preference: ProjectRespDTO
}
interface GroupPreference {
  preferenceId: number
  preference: Project
}
interface GroupRspDTO {
  GroupName: string
  GroupDescription: string
  MaxMemberNum: number
  GroupMembers: UserProfileSlimDTO[]
  GroupOwner: string
  CreatedBy: number
  Preferences: GroupPreferenceDTO[]
}

interface Group {
  groupName: string
  groupDescription: string
  maxMemberNum: number
  groupMembers: UserProfileSlim[]
  groupOwner: string
  createdBy: number
  preferences: GroupPreference[]
}

export { GroupRspDTO, Group, GroupPreferenceDTO }
