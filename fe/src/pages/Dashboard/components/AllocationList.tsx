import { Flex, List, Button } from 'antd'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
// import AllocationListItem from './AllocationListItem'
import { getThemeToken } from '../../../utils/styles'
import { Allocation } from '../../../types/proj_grp'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import LinkButton from '../../../components/LinkButton'
import route from '../../../constant/route'
import { AllocationRspDTO } from '../../../types/allocation'
import AllocationListItem from './AllocationListItem'
import {
  getAllocations,
  approveAllocation,
  rejectAllocation,
  createAllocation,
} from '../../../api/allocAPI'
type Props = {
  className?: string
}

const Wrapper = styled.div`
  box-shadow: ${getThemeToken('boxShadow')};
`

const _AllocationList = styled(List)`
  height: calc(100vh - 10rem);
  overflow-y: auto;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px; /* Optional: Add some space between buttons */
`

const StyledButton = styled(Button)`
  height: 32px;
  background-color: black;
  color: white;
  border: none;
  text-align: center;
`

const Title = styled.span`
  font-size: 16px;
  font-weight: bold;
`

const AllocationList = ({ className = '' }: Props) => {
  const [filteredLists, setFilteredLists] = useState<Allocation[]>([])
  const { msg } = useGlobalComponentsContext()

  const transformData = (data: AllocationRspDTO[]): Allocation[] => {
    const projectMap = new Map<number, Allocation>()
    data.forEach((item) => {
      const allocation: Allocation = {
        allocationId: item.allocationId, // assuming this is required
        projectId: item.project.projectId,
        projectName: item.project.projectName || 'Default Project Name',
        groupName: item.group.groupName || 'Default Group Name',
        groupId: item.group.groupId || 0,
      }
      if (!projectMap.has(allocation.projectId)) {
        projectMap.set(allocation.projectId, allocation)
      }
    })
    return Array.from(projectMap.values())
  }
  useEffect(() => {
    const toFetch = async () => {
      try {
        const response = await getAllocations()
        console.log('allocation result', response)
        const transformedData = transformData(response.data)
        setFilteredLists(transformedData)
      } catch (e) {
        msg.err('Network error')
      }
    }
    toFetch()
  }, [msg])

  const handleAutoAllocate = async () => {
    try {
      const response = await createAllocation()
      console.log('Response from auto allocate:', response.data)
      msg.success('Auto Allocate initiated')
    } catch (error) {
      console.error('Error during auto allocate:', error)
      msg.err('Auto Allocate failed')
    }
  }

  const handleApproveAll = async () => {
    try {
      const response = await approveAllocation()
      console.log('Approve all:', response.data)
      msg.success('Approve all Allocations!')
    } catch (error) {
      console.error('Error during auto allocate:', error)
      msg.err('Auto Allocate failed')
    }
  }

  const handleRejectAll = async () => {
    try {
      const response = await rejectAllocation()
      console.log('Reject all:', response.data)
      msg.success('Reject all Allocations!')
    } catch (error) {
      console.error('Error during auto allocate:', error)
      msg.err('Allocation Reject failed')
    }
  }

  return (
    <Wrapper className={className}>
      <_AllocationList
        itemLayout="horizontal"
        bordered
        header={
          <Flex justify="space-between" align="center">
            <Title>Allocation List</Title>
            <ButtonContainer>
              <StyledButton
                size="small"
                color="green"
                onClick={handleApproveAll}
              >
                Approve
              </StyledButton>
              <StyledButton
                size="small"
                color="green"
                onClick={handleRejectAll}
              >
                Reject
              </StyledButton>
              <StyledButton size="small" onClick={handleAutoAllocate}>
                Auto Allocate
              </StyledButton>
            </ButtonContainer>
          </Flex>
        }
        dataSource={filteredLists}
        renderItem={(item) => (
          <List.Item
            actions={[
              <LinkButton
                size="small"
                to={`${route.ALLOCATION}/${(item as Allocation).projectId}`}
                key={(item as Allocation).projectId}
              >
                Edit
              </LinkButton>,
            ]}
          >
            <AllocationListItem item={item as Allocation} />
          </List.Item>
        )}
      />
    </Wrapper>
  )
}

export default AllocationList
