import { Project, ProjectRespDTO } from './proj'
import { UserProfileSlim, UserProfileSlimDTO } from './user'

interface GroupPreferenceRspDTO {
  PreferenceID: number
  Preference: ProjectRespDTO
  Rank: number
  Lock: boolean
  Group: number
}
interface GroupPreferenceReqDTO {
  Preference: number
  Rank: number
}
interface GroupPreference {
  preferenceId: number
  preference: Project
  rank: number
  lock: boolean
  groupId: number
}

interface GroupRspDTO {
  GroupID: number
  GroupName: string
  GroupDescription: string
  MaxMemberNum: number
  GroupMembers: UserProfileSlimDTO[]
  GroupOwner: string
  CreatedBy: number
  Preferences: GroupPreferenceRspDTO[]
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

export {
  GroupRspDTO,
  Group,
  GroupPreferenceRspDTO,
  GroupPreferenceReqDTO,
  GroupPreference,
}
