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

export {
  GroupRspDTO,
  Group,
  GroupPreferenceDTO,
  GroupCreate,
  GroupReqDTO,
  GroupJoinDTO,
  GroupLeaveDTO,
}
