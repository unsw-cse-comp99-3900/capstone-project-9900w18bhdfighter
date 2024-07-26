import { Course, CourseRspDTO } from './course'
import {
  Project,
  ProjectRespDTO,
  ProjectSlimSlim,
  ProjectSlimSlimDTO,
} from './proj'
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
  Project: ProjectSlimSlimDTO | null
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
  project: ProjectSlimSlim | null
}
interface GroupSlimSlimRspDTO {
  GroupID: number
  GroupName: string
}
interface GroupSlimSlim {
  groupId: number
  groupName: string
}
interface GroupSlim {
  groupId: number
  groupName: string
  groupDescription: string
}

type GroupPreferenceSlim = Pick<
  GroupPreference,
  'preferenceId' | 'preference' | 'groupId' | 'rank'
>

export {
  Group,
  GroupJoinDTO,
  GroupLeaveDTO,
  GroupPreference,
  GroupPreferenceReqDTO,
  GroupPreferenceRspDTO,
  GroupPreferenceSlim,
  GroupReqDTO,
  GroupRspDTO,
  GroupSlim,
  GroupSlimSlim,
  GroupSlimSlimRspDTO,
}
