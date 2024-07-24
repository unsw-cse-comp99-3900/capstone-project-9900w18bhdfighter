import { Flex, List, Button } from 'antd'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import AllocationListItem from './AllocationListItem'
import { getThemeToken } from '../../../utils/styles'
import { Allocation } from '../../../types/proj_grp'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import LinkButton from '../../../components/LinkButton'
import route from '../../../constant/route'
import { Project } from '../../../types/proj'
import api from '../../../api/config'

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

  const handleAutoAllocate = async () => {
    // Handle auto allocate button click
    try {
      // 这里API有问题
      const response = await api.post('/api/allocations')
      console.log('Response from auto allocate:', response.data)
      msg.success('Auto Allocate initiated')
    } catch (error) {
      console.error('Error during auto allocate:', error)
      msg.err('Auto Allocate failed')
    }
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
              <LinkButton
                size="small"
                to={`${route.ALLOCATION}/${(item as Project).id}`}
                key={(item as Project).id}
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
