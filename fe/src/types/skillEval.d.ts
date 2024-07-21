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
export { SkillEvalReqDTO, SkillEvalRspDTO, SkillEval }
