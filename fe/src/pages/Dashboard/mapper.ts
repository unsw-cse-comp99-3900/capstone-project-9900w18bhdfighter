import { Project, ProjectRespDTO, Skill, SkillRspDTO } from '../../types/proj'
import { Area } from '../../types/user'

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

export { mapProjectDTOToProject }
