import { Button, Flex, List, Popover, Space, Spin } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
// import AllocationListItem from './AllocationListItem'
import {
  approveAllocation,
  createAllocation,
  getAllocations,
  rejectAllocation,
} from '../../../api/allocAPI'
import LinkButton from '../../../components/LinkButton'
import route from '../../../constant/route'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { AllocationRspDTO } from '../../../types/allocation'
import { errHandler } from '../../../utils/parse'
import { getThemeToken } from '../../../utils/styles'
import AllocationListItem from './AllocationListItem'
import DebounceSimpleSearcher from '../../../components/DebounceSimpleSearcher'
import { FaSearch } from 'react-icons/fa'
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

const StyledButton = styled(Button)<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
`

const Mask = styled.div`
  background-color: rgba(0, 0, 0, 0);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`
const _Spin = styled(Spin)`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000;
`
export type AllocationGrouped = {
  projectId: number
  projectName: string
  group: {
    groupId: number
    groupName: string
  }[]
}
const transformData = (data: AllocationRspDTO[]) => {
  const transformedData: AllocationGrouped[] = []
  data.forEach((item) => {
    const projectIndex = transformedData.findIndex(
      (project) => project.projectId === item.project.projectId
    )
    if (projectIndex === -1) {
      transformedData.push({
        projectId: item.project.projectId,
        projectName: item.project.projectName,
        group: [
          {
            groupId: item.group.groupId,
            groupName: item.group.groupName,
          },
        ],
      })
    } else {
      ;(transformedData[projectIndex] as AllocationGrouped).group.push({
        groupId: item.group.groupId,
        groupName: item.group.groupName,
      })
    }
  })
  console.log('transformedData', transformedData)

  return transformedData
}
const AllocationList = ({ className = '' }: Props) => {
  const [allocListGroupedByProj, setAllocListGroupedByProj] = useState<
    AllocationGrouped[]
  >([])
  const [filteredLists, setFilteredLists] = useState<AllocationGrouped[]>([])
  const [loading, setLoading] = useState(false)
  const { msg } = useGlobalComponentsContext()
  console.log(allocListGroupedByProj)

  const shouldDisplayRejectButton = allocListGroupedByProj.length > 0

  const shouldDisplayApproveButton = allocListGroupedByProj.length > 0
  const shouldDisplayAutoAllocateButton = allocListGroupedByProj.length === 0
  const toFetch = async () => {
    try {
      const response = await getAllocations()
      console.log('allocation result', response)
      const transformedData = transformData(response.data)
      setAllocListGroupedByProj(transformedData)
      setFilteredLists(transformedData)
    } catch (e) {
      msg.err('Network error')
    }
  }
  useEffect(() => {
    toFetch()
  }, [])

  const handleAutoAllocate = async () => {
    try {
      setLoading(true)
      await createAllocation()
      await toFetch()
      msg.success('Auto Allocate initiated')
    } catch (error) {
      errHandler(
        error,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    } finally {
      setLoading(false)
    }
  }

  const handleApproveAll = async () => {
    try {
      setLoading(true)
      const response = await approveAllocation()
      console.log('Approve all:', response.data)
      msg.success('Approve all Allocations!')

      await toFetch()
    } catch (error) {
      console.error('Error during auto allocate:', error)
      errHandler(
        error,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRejectAll = async () => {
    try {
      await rejectAllocation()
      await toFetch()
      msg.success('Reject all Allocations!')
    } catch (error) {
      console.error('Error during auto allocate:', error)
      msg.err('Allocation Reject failed')
    }
  }
  const handleSearchChange = (val: string) => {
    setFilteredLists(
      allocListGroupedByProj.filter((item) => {
        return (item as AllocationGrouped).projectName
          .toLowerCase()
          .includes(val.toLowerCase())
      })
    )
  }
  return (
    <Wrapper className={className}>
      {loading && <Mask />}
      {loading && <_Spin />}
      <_AllocationList
        itemLayout="horizontal"
        bordered
        header={
          <Flex
            style={{
              height: '2rem',
            }}
            justify="space-between"
            align="center"
          >
            <Flex align="center" gap={10}>
              Allocation List
              <Popover
                trigger={['click']}
                placement="top"
                content={
                  <DebounceSimpleSearcher
                    placeholder="Search by project name"
                    handleChange={handleSearchChange}
                  />
                }
              >
                <FaSearch style={{ cursor: 'pointer' }} />
              </Popover>
            </Flex>
            <Space>
              <StyledButton
                visible={shouldDisplayApproveButton}
                size="small"
                type="primary"
                onClick={handleApproveAll}
              >
                Approve
              </StyledButton>
              <StyledButton
                visible={shouldDisplayRejectButton}
                size="small"
                type="primary"
                danger
                onClick={handleRejectAll}
              >
                Reject
              </StyledButton>
              <StyledButton
                visible={shouldDisplayAutoAllocateButton}
                type="primary"
                size="small"
                onClick={handleAutoAllocate}
                loading={loading}
              >
                Allocate
              </StyledButton>
            </Space>
          </Flex>
        }
        dataSource={filteredLists}
        renderItem={(item) => (
          <List.Item
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            actions={[
              <LinkButton
                size="small"
                to={`${route.ALLOCATION}/${(item as AllocationGrouped).projectId}`}
                key={(item as AllocationGrouped).projectId}
              >
                Edit
              </LinkButton>,
            ]}
          >
            <AllocationListItem item={item as AllocationGrouped} />
          </List.Item>
        )}
      />
    </Wrapper>
  )
}

export default AllocationList
