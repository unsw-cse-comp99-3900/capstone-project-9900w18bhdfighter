import {
  Project,
  ProjectReqDTO,
  ProjectRespDTO,
  Skill,
  SkillRspDTO,
} from '../types/proj'
import { Area } from '../types/user'
import api from './config'

const createProject = async (proj: ProjectReqDTO) => {
  return api.post<ProjectRespDTO>('project_creation/', proj)
}

const updateProject = async (proj: ProjectReqDTO, projId: number | string) => {
  return api.put<ProjectRespDTO>(`project_update/${projId}/`, proj)
}

const getAllProjects = async () => {
  return api.get<ProjectRespDTO[]>('projects/')
}

const getProjectsByCreator = async (creatorEmail: string) => {
  return api.get<ProjectRespDTO[]>(`projects/createdBy/${creatorEmail}/`)
}
const getProjectsByOwner = async (owner: string) => {
  return api.get<ProjectRespDTO[]>(`projects/ownBy/${owner}/`)
}

const getProjectsByOwnerAndCreator = async (owner: string, creator: string) => {
  return api.get<ProjectRespDTO[]>(
    `projects/own_and_create/${owner}/${creator}/`
  )
}
const getProjectById = async (id: number | string) => {
  return api.get<ProjectRespDTO>(`projects/${id}/`)
}

const getProjectByParticipant = async (participantId: string | number) => {
  return api.get<ProjectRespDTO[]>(`api/projects/users/${participantId}/`)
}
const getAutoCompleteProjectsByName = async (projectName: string) => {
  return api.get<{ data: ProjectRespDTO[] }>('api/projects/autocomplete-name', {
    params: {
      name_substring: projectName,
    },
  })
}
//mapper
const mapProjectDTOToProject: (_projectRespDTO: ProjectRespDTO) => Project = (
  projectRespDTO: ProjectRespDTO
) => {
  const mapSkillRspDTOToSkill = (skillRspDTO: SkillRspDTO): Skill => {
    const area: Area = {
      id: skillRspDTO.Area.AreaID,
      name: skillRspDTO.Area.AreaName,
    }

    return {
      area: area,
      skillId: skillRspDTO.SkillID,
      skillName: skillRspDTO.SkillName,
    }
  }

  // Mapping ProjectRespDTO to Project
  const project: Project = {
    id: projectRespDTO.ProjectID,
    name: projectRespDTO.ProjectName,
    description: projectRespDTO.ProjectDescription,
    owner: projectRespDTO.ProjectOwner,
    maxNumOfGroup: projectRespDTO.MaxNumOfGroup,
    requiredSkills: projectRespDTO.RequiredSkills.map((skillRecord) =>
      mapSkillRspDTOToSkill(skillRecord.Skill)
    ),
    projectOwnerId: projectRespDTO.projectOwner_id,
    createdBy: projectRespDTO.CreatedBy,
  }

  return project
}

export {
  getAllProjects,
  createProject,
  updateProject,
  getProjectsByCreator,
  getProjectsByOwner,
  getProjectsByOwnerAndCreator,
  getProjectById,
  mapProjectDTOToProject,
  getProjectByParticipant,
  getAutoCompleteProjectsByName,
}
