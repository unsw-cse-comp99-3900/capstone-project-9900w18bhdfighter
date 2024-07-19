import { Area } from './user'

interface Project {
  id: number
  name: string
  description: string
  owner: string
  maxNumOfGroup: number
  requiredSkills: Skill[]
  projectOwnerId: number
  createdBy: number
}
interface ProjectInfo {
  id: number
  name: string
}

type ProjectCreate = {
  ProjectName: string
  ProjectDescription: string
  ProjectOwner: string
}

interface Skill {
  area: Area
  skillId: number
  skillName: string
}
interface SkillReqDTO {
  area_id: number
  skill: string
}

interface ProjectReqDTO {
  ProjectName: string
  ProjectDescription: string
  ProjectOwner: string
  requiredSkills: SkillReqDTO[]
  MaxNumOfGroup: number
}
interface AreaRspDTO {
  AreaID: number
  AreaName: string
}
interface SkillRspDTO {
  SkillID: number
  SkillName: string
  Area: AreaRspDTO
}
interface ProjectRespDTO {
  ProjectID: number
  ProjectName: string
  ProjectDescription: string
  ProjectOwner: string
  RequiredSkills: Record<'Skill', SkillRspDTO>[]
  CreatedBy: number
  MaxNumOfGroup: number
  projectOwner_id: number
}

type ProjectProfileSlim = Pick<Project, 'id' | 'name' | 'owner'>
type ProjectProfileSlimDTO = Pick<Project, 'id' | 'name' | 'owner'>
export {
  Project,
  ProjectCreate,
  Skill,
  ProjectReqDTO,
  ProjectRespDTO,
  SkillRspDTO,
  ProjectProfileSlim,
  ProjectProfileSlimDTO,
  ProjectInfo,
}
