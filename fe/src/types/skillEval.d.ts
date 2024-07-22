interface SkillEvalReqDTO {
  Note: string
  Score: number
  Skill: number
}

interface SkillEvalRspDTO {
  Note: string
  Score: number
  Skill: number
}

interface SkillEval {
  note: string
  score: number
  skill: number
}

interface SkillEvaluationData {
  ProjectName: string
  ProjectDescription: string
  ProjectOwner: string
  RequiredSkills: RequiredSkill[]
}
interface RequiredSkill {
  Skill: Skill
}

interface Area {
  AreaID: number
  AreaName: string
}

interface Skill {
  Area: Area
  SkillID: number
  SkillName: string
}
export { SkillEvalReqDTO, SkillEvalRspDTO, SkillEval, SkillEvaluationData }
