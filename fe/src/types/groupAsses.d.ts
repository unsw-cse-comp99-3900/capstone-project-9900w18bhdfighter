import { ProjectSlimSlim, ProjectSlimSlimDTO } from './proj'
import { Submission, SubmissionRspDTO } from './submission'
import { UserProfileSlim, UserProfileSlimDTO } from './user'

interface GroupScoreRspDTO {
  Id: number
  score: number
  feedback: string
  markedBy: UserProfileSlimDTO
}

interface GroupAssRspDTO {
  GroupName: string
  GroupID: number
  Project: ProjectSlimSlimDTO | null
  GroupScore: GroupScoreRspDTO | null
  Submission: SubmissionRspDTO | null
}
interface GroupAssReqDTO {
  score: number
  feedback: string
  group: number
  markers: number
}
interface GroupScore {
  id: number
  score: number
  feedback: string
  markedBy: UserProfileSlim
}
interface GroupAss {
  groupName: string
  groupId: number
  project: ProjectSlimSlim | null
  groupScore: GroupScore | null
  submission: Submission | null
}

export type { GroupAss, GroupAssRspDTO, GroupScoreRspDTO, GroupAssReqDTO }
