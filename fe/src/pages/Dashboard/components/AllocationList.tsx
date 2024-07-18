import { Flex, List, Button } from 'antd'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import AllocationListItem from './AllocationListItem'
import { getThemeToken } from '../../../utils/styles'
import { Allocation } from '../../../types/proj_grp'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'

// Mock data
const mockData: Allocation[] = [
  {
    allocationId: 1,
    projectName: 'Project 1',
    groupName: 'Group A',
    groupDescription: 'Description A',
  },
  {
    allocationId: 2,
    projectName: 'Project 2',
    groupName: 'Group B',
    groupDescription: 'Description B',
  },
]

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

const AllocationList = ({ className = '' }: Props) => {
  const [filteredLists, setFilteredLists] = useState<Allocation[]>([])
  const { msg } = useGlobalComponentsContext()

  useEffect(() => {
    const toFetch = async () => {
      try {
        // Simulate an API call
        setFilteredLists(mockData)
      } catch (e) {
        msg.err('Network error')
      }
    }
    toFetch()
  }, [msg])

  const handleApprove = (allocationId: number) => {
    // Handle approve button click
    console.log(`Approved allocation with ID: ${allocationId}`)
    msg.success(`Approved allocation with ID: ${allocationId}`)
  }
  const handleAutoAllocate = () => {
    // Handle auto allocate button click
    console.log('Auto Allocate button clicked')
    msg.success('Auto Allocate initiated')
  }
  return (
    <Wrapper className={className}>
      <_AllocationList
        itemLayout="horizontal"
        bordered
        header={
          <Flex justify="space-between" align="center">
            Allocation List
            <Button size="small" onClick={handleAutoAllocate}>
              Auto Allocate
            </Button>
          </Flex>
        }
        dataSource={filteredLists}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                size="small"
                onClick={() => handleApprove((item as Allocation).allocationId)}
                key={(item as Allocation).allocationId}
              >
                Approve
              </Button>,
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
