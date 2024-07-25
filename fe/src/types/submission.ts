import { GroupSlimSlim, GroupSlimSlimRspDTO } from './group'
import { ProjectSlimSlim, ProjectSlimSlimDTO } from './proj'

interface SubmissionReqDTO {
  Group: number
  Project: number
  SubmissionDemoVideo: File | null
  SubmissionReport: File | null
  GithubLink: string | null
  SubmitBy: number
}
interface SubmissionRspDTO {
  SubmissionID: number
  Group: GroupSlimSlimRspDTO
  Project: ProjectSlimSlimDTO
  SubmissionTime: string
  SubmissionDemoVideo: string | null
  SubmissionReport: string | null
  GithubLink: string | null
  FileNameReport: string | null
  FileNameDemo: string | null
}

interface Submission {
  submissionID: number
  group: GroupSlimSlim
  project: ProjectSlimSlim
  submissionTime: string
  submissionDemoVideo: string | null
  submissionReport: string | null
  githubLink: string | null
  fileNameReport: string | null
  fileNameDemo: string | null
}

export type { Submission, SubmissionReqDTO, SubmissionRspDTO }
