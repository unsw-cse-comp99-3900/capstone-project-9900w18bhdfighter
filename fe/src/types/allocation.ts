interface Allocation {
  allocationId: number
  group: {
    groupName: string
    groupId: number
  }
  project: {
    projectName: string
    projectId: number
  }
}

interface AllocationDTO {
  allocationId: number
  groupId: number
  projectId: number
}

interface AllocationReqDTO {
  groupId: number
  projectId: number
}
interface AllocationRspDTO {
  allocationId: number
  group: {
    groupName: string
    groupId: number
  }
  project: {
    projectName: string
    projectId: number
  }
}

export type { Allocation, AllocationDTO, AllocationReqDTO, AllocationRspDTO }
