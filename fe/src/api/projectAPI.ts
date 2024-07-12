import { ProjectReqDTO, ProjectRespDTO } from '../types/proj'
import api from './config'

const createProject = async (proj: ProjectReqDTO) => {
  return api.post<ProjectRespDTO>('project_creation/', proj)
}

const updateProject = async (proj: ProjectReqDTO, projId: number) => {
  return api.put<ProjectRespDTO>(`project_update/${projId}/`, proj)
}

const getAllProjects = async () => {
  return api.get<ProjectRespDTO[]>('projects/')
}

const getProjectsByCreator = async (creator: string) => {
  return api.get<ProjectRespDTO[]>(`projects/createdBy/${creator}/`)
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
export {
  getAllProjects,
  createProject,
  updateProject,
  getProjectsByCreator,
  getProjectsByOwner,
  getProjectsByOwnerAndCreator,
  getProjectById,
}
