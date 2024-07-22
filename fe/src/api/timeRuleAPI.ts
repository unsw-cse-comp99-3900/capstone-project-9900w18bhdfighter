import { TimeRule, TimeRuleReqDTO, TimeRuleRspDTO } from '../types/timeRule'
import api from './config'

const getTimeRules = async () => {
  return api.get<{ data: TimeRuleRspDTO[] }>('/api/time-rules')
}

const createTimeRule = async (data: TimeRuleReqDTO) => {
  return api.post<TimeRuleReqDTO>('/api/time-rules', data)
}
const deleteTimeRule = async (id: number | string) => {
  return api.delete(`/api/time-rules/${id}`)
}
const updateTimeRule = async (id: number | string, isActive: boolean) => {
  return api.put(`/api/time-rules/${id}`, {
    IsActive: isActive,
  })
}

//mapper
const mapTimeRuleDTOToTimeRule = (dto: TimeRuleRspDTO): TimeRule => {
  return {
    isActive: dto.IsActive,
    groupFreezeTime: dto.GroupFreezeTime,
    projectDeadline: dto.ProjectDeadline,
    ruleName: dto.RuleName,
    id: dto.TimeNodeID,
  }
}
export {
  getTimeRules,
  createTimeRule,
  deleteTimeRule,
  mapTimeRuleDTOToTimeRule,
  updateTimeRule,
}
