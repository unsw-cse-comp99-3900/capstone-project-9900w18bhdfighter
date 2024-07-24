import { Course, CourseRspDTO } from './course'
import { Project, ProjectRespDTO } from './proj'
import { UserProfileSlim, UserProfileSlimDTO } from './user'

interface GroupReqDTO {
  GroupName: string
  GroupDescription: string
  MaxMemberNumber: number
  CourseCode: number
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
  groupId: number
}

interface GroupRspDTO {
  GroupID: number
  GroupName: string
  GroupDescription: string
  MaxMemberNumber: number
  GroupMembers: UserProfileSlimDTO[]
  GroupOwner: string
  CreatedBy: number
  Preferences: GroupPreferenceRspDTO[]
  CourseCode: CourseRspDTO
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
  course: Course
}

export interface GroupSlim {
  groupId: number
  groupName: string
  groupDescription: string
}

type GroupPreferenceSlim = Pick<
  GroupPreference,
  'preferenceId' | 'preference' | 'groupId' | 'rank'
>

export {
  GroupRspDTO,
  Group,
  GroupReqDTO,
  GroupJoinDTO,
  GroupLeaveDTO,
  GroupPreferenceRspDTO,
  GroupPreferenceReqDTO,
  GroupPreference,
  GroupPreferenceSlim,
}
