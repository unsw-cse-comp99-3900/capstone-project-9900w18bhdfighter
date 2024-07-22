interface TimeRuleReqDTO {
  GroupFreezeTime: string
  ProjectDeadline: string
  RuleName: string
  IsActive: boolean
}

interface TimeRuleRspDTO {
  TimeNodeID: number
  GroupFreezeTime: string
  ProjectDeadline: string
  RuleName: string
  IsActive: boolean
}

interface TimeRule {
  id: number
  groupFreezeTime: string
  projectDeadline: string
  ruleName: string
  isActive: boolean
}

export { TimeRuleReqDTO, TimeRuleRspDTO, TimeRule }
