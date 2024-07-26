import {
  GroupAssReqDTO,
  GroupAssRspDTO,
  GroupScoreRspDTO,
} from '../types/groupAsses'
import api from './config'
import { mapSubmissionDTOToSubmission } from './submissionAPI'
import { mapUserSlimProfileDTOUserProfileSlim } from './userAPI'

const mapGroupScoreDTOToGroupScore = (groupScoreDTO: GroupScoreRspDTO) => {
  const markedBy = mapUserSlimProfileDTOUserProfileSlim(groupScoreDTO.markedBy)
  return {
    id: groupScoreDTO.Id,
    score: groupScoreDTO.score,
    feedback: groupScoreDTO.feedback,
    markedBy: markedBy,
  }
}

const mapGroupAssesDTOToGroupAsses = (groupAssesDTO: GroupAssRspDTO) => {
  const project = groupAssesDTO.Project
    ? {
        projectId: groupAssesDTO.Project.ProjectID,
        projectName: groupAssesDTO.Project.ProjectName,
      }
    : null

  const groupScore = groupAssesDTO.GroupScore
    ? mapGroupScoreDTOToGroupScore(groupAssesDTO.GroupScore)
    : null
  const submission = groupAssesDTO.Submission
    ? mapSubmissionDTOToSubmission(groupAssesDTO.Submission)
    : null
  return {
    groupName: groupAssesDTO.GroupName,
    groupId: groupAssesDTO.GroupID,
    project,
    groupScore,
    submission,
  }
}

const getAllGroupAsses = async () => {
  try {
    const res = await api.get<GroupAssRspDTO[]>('api/group-assessments')
    return res.data.map(mapGroupAssesDTOToGroupAsses)
  } catch (error) {
    console.error('Failed to fetch group asses', error)
    throw error
  }
}

const getGroupAssesByGroup = async (groupId: number | string) => {
  try {
    const res = await api.get<GroupAssRspDTO>(
      `api/group-assessments/${groupId}`
    )
    return mapGroupAssesDTOToGroupAsses(res.data)
  } catch (error) {
    console.error('Failed to fetch group asses', error)
    throw error
  }
}

const getPDFReport = async () => {
  return await api.get('api/generate_report/', {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/pdf',
    },
  })
}
const createOrUpdateGroupAsses = async (groupAssesReqDTO: GroupAssReqDTO) => {
  return api.post('api/group-assessments', groupAssesReqDTO)
}

export {
  createOrUpdateGroupAsses,
  getAllGroupAsses,
  getGroupAssesByGroup,
  getPDFReport,
}
