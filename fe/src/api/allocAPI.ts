import { AllocationReqDTO, AllocationRspDTO } from '../types/allocation'
import api from './config'

const getAllocations = async () =>
  api.get<AllocationRspDTO[]>('api//allocations')

const approveAllocation = async () => api.post('api/allocations/approve')

const rejectAllocation = async () => api.delete('api/allocations')

const createAllocation = async () => api.post('api/allocations')

const updateAllocation = async (allocationId: number, dto: AllocationReqDTO) =>
  api.put(`api/allocations/${allocationId}`, dto)
export default {
  getAllocations,
  approveAllocation,
  rejectAllocation,
  createAllocation,
  updateAllocation,
}
