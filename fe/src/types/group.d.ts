import { Project, ProjectRespDTO } from './proj'
import { UserProfileSlim, UserProfileSlimDTO } from './user'

type GroupCreate = {
  GroupName: string
  GroupDescription: string
  // GroupOwner: string
}

interface GroupReqDTO {
  GroupName: string
  GroupDescription: string
  MaxMemberNumber: number
}

interface GroupJoinDTO {
  group_id: number
  student_id: number
}

interface GroupLeaveDTO {
  group_id: number
  student_id: number
}
// interface GroupPreferenceDTO {

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
  GroupCreate,
  GroupReqDTO,
  GroupJoinDTO,
  GroupLeaveDTO,
  GroupPreferenceRspDTO,
  GroupPreferenceReqDTO,
  GroupPreference,
}
