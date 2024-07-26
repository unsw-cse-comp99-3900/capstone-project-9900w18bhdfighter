import {
  Submission,
  SubmissionReqDTO,
  SubmissionRspDTO,
} from '../types/submission'
import api from './config'

//mapper
const mapSubmissionDTOToSubmission: (
  _submissionRespDTO: SubmissionRspDTO
) => Submission = (submissionRespDTO: SubmissionRspDTO) => {
  const group = {
    groupId: submissionRespDTO.Group.GroupID,
    groupName: submissionRespDTO.Group.GroupName,
  }
  const project = {
    projectId: submissionRespDTO.Project.ProjectID,
    projectName: submissionRespDTO.Project.ProjectName,
  }
  return {
    submissionID: submissionRespDTO.SubmissionID,
    group: group,
    project: project,
    submissionTime: submissionRespDTO.SubmissionTime,
    submissionDemoVideo: submissionRespDTO.SubmissionDemoVideo,
    submissionReport: submissionRespDTO.SubmissionReport,
    githubLink: submissionRespDTO.GithubLink,
    fileNameReport: submissionRespDTO.FileNameReport,
    fileNameDemo: submissionRespDTO.FileNameDemo,
  }
}

const getAllSubmissions = async (): Promise<Submission[]> => {
  try {
    const res = await api.get<SubmissionRspDTO[]>('api/submissions')
    return res.data.map(mapSubmissionDTOToSubmission)
  } catch (error) {
    console.error('Failed to fetch submissions', error)
    throw error
  }
}
const submitSubmission = async (
  submissionReqDTO: SubmissionReqDTO
): Promise<Submission> => {
  const formData = new FormData()
  formData.append('Group', submissionReqDTO.Group.toString())
  formData.append('Project', submissionReqDTO.Project.toString())
  if (submissionReqDTO.SubmissionDemoVideo) {
    formData.append('SubmissionDemoVideo', submissionReqDTO.SubmissionDemoVideo)
  }
  if (submissionReqDTO.SubmissionReport) {
    formData.append('SubmissionReport', submissionReqDTO.SubmissionReport)
  }
  if (submissionReqDTO.GithubLink) {
    formData.append('GithubLink', submissionReqDTO.GithubLink)
  }
  formData.append('SubmitBy', submissionReqDTO.SubmitBy.toString())

  return api.post('api/submissions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
const updateSubmission = async (
  id: number | string,
  submissionReqDTO: Partial<SubmissionReqDTO>
): Promise<Submission> => {
  const formData = new FormData()
  const group = submissionReqDTO.Group as number
  const project = submissionReqDTO.Project as number
  formData.append('Group', group.toString())
  formData.append('Project', project.toString())

  if (Object.keys(submissionReqDTO).includes('SubmissionDemoVideo')) {
    formData.append(
      'SubmissionDemoVideo',
      submissionReqDTO.SubmissionDemoVideo || ''
    )
  }
  if (Object.keys(submissionReqDTO).includes('SubmissionReport')) {
    formData.append('SubmissionReport', submissionReqDTO.SubmissionReport || '')
  }
  if (submissionReqDTO.GithubLink) {
    formData.append('GithubLink', submissionReqDTO.GithubLink)
  }
  formData.append('SubmitBy', (submissionReqDTO.SubmitBy as number).toString())

  return api.put(`api/submissions/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const getSubmissionByGroup = async (groupId: number) => {
  try {
    const res = await api.get<SubmissionRspDTO[]>(
      `api/submissions/groups/${groupId}`
    )
    return res.data.map(mapSubmissionDTOToSubmission)
  } catch (error) {
    console.error('Failed to fetch submissions', error)
    throw error
  }
}
export {
  getAllSubmissions,
  getSubmissionByGroup,
  mapSubmissionDTOToSubmission,
  submitSubmission,
  updateSubmission,
}
