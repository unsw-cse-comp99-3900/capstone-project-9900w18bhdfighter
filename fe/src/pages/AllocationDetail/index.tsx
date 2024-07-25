import {
  Button,
  Descriptions,
  Flex,
  Form,
  List,
  message,
  Modal,
  Typography,
} from 'antd'
import React, { ReactNode, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import {
  addOneAllocation,
  delOneAllocation,
  getAllocations,
} from '../../api/allocAPI'
import { getAutoCompleteGroups, mapGroupDTOToGroup } from '../../api/groupAPI'
import { getProjectById, mapProjectDTOToProject } from '../../api/projectAPI'
import GroupSearchBar from '../../components/GroupSearchBar'
import route from '../../constant/route'
import { useGlobalComponentsContext } from '../../context/GlobalComponentsContext'
import { Group } from '../../types/group'
import { Project } from '../../types/proj'
import { errHandler } from '../../utils/parse'
import { getThemeToken } from '../../utils/styles'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const ListHeader = styled.div`
  font-weight: bold;
`

const ListItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

interface GroupValue {
  label: ReactNode
  value: number
  title: string
  description: string
}

interface AllocationReqDTO {
  groupId: number
  projectId: number
}

interface Allocation {
  allocationId: number
  group: {
    groupId: number
    groupName: string
  }
  project: {
    projectId: number
    projectName: string
  }
}

const AllocationDetail: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [autoCompGroupList, setAutoCompGroupList] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<GroupValue | null>(null)
  const [allocationList, setAllocationList] = useState<Allocation[]>([]) // Use Allocation type
  const { msg } = useGlobalComponentsContext()
  const { id } = useParams<{ id: string }>()
  const [projectD, setProjectD] = useState<Project | null>(null)

  const getProjectDetail = async (pId: number | string) => {
    try {
      const response = await getProjectById(pId)
      setProjectD(mapProjectDTOToProject(response.data))
    } catch (err) {
      console.error('Error fetching project:')
    }
  }
  const showModal = () => {
    setIsModalVisible(true)
  }

  const getAllocationList = async () => {
    if (id) {
      console.log('Fetching allocations for projectId:', id)
      try {
        const response = await getAllocations()
        console.log('allocation result', response)
        const allocations = response.data.filter(
          (allocation: Allocation) =>
            allocation.project.projectId === parseInt(id, 10)
        )
        setAllocationList(allocations)
      } catch (error) {
        errHandler(
          error,
          (str) => msg.err(str),
          (str) => msg.err(str)
        )
      }
    }
  }

  const handleOk = () => {
    if (!selectedGroup || !id) {
      console.error('No group selected or project id is undefined')
      return
    }

    Modal.confirm({
      title: 'Confirm Submission',
      content: 'Are you sure you want to submit?',
      onOk: async () => {
        console.log('Form submitted')

        const requestData: AllocationReqDTO = {
          groupId: selectedGroup.value,
          projectId: parseInt(id, 10),
        }

        try {
          const response = await addOneAllocation(requestData)
          console.log('Response from server:', response)
          setIsModalVisible(false)
          // Here you might want to refresh the allocation list or handle the response
          getAllocationList()
          message.success('Allocation submitted successfully!')
        } catch (error) {
          console.error('Error submitting allocation:', error)
        }
      },
      onCancel: () => {
        console.log('Submission cancelled')
      },
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showConfirmModal = (allocationId: number, groupName: string) => {
    Modal.confirm({
      title: 'Are you sure you want to remove this allocation?',
      content: `You are about to remove ${groupName}.`,
      onOk: async () => {
        console.log(`Removing item: ${allocationId}`)
        try {
          await delOneAllocation(allocationId)
          message.success('Allocation removed successfully!')
          // Update the allocation list after removal
          setAllocationList((prev) =>
            prev.filter((item) => item.allocationId !== allocationId)
          )
        } catch (error) {
          console.error('Error removing allocation:', error)
          message.error('Failed to remove allocation.')
        }
      },
      onCancel: () => {
        console.log('Removal cancelled')
      },
    })
  }

  const fetchAutoCompleteGroups = async (val: string) => {
    const res = await getAutoCompleteGroups(val)
    setAutoCompGroupList(res.data.data.map(mapGroupDTOToGroup))
  }

  const handleChange = async (val: GroupValue) => {
    console.log(`Selected group: ${val.label}`)
    setSelectedGroup(val)
  }

  useEffect(() => {
    if (!id) {
      return
    }

    getAllocationList()
    getProjectDetail(parseInt(id))
  }, [id])

  return (
    <Wrapper>
      <HeaderWrapper>
        <Descriptions
          title={
            <Flex vertical>
              Allocation Detail - {projectD?.name}
              <Typography.Text type="secondary"></Typography.Text>
              <Typography.Text type="secondary">
                ({allocationList.length}/{projectD?.maxNumOfGroup})
              </Typography.Text>
            </Flex>
          }
          bordered={false}
          style={{ marginBottom: 0 }}
        />
        <Button type="primary" onClick={showModal}>
          Add Allocation
        </Button>
      </HeaderWrapper>
      <List
        style={{ width: '100%', marginTop: 20 }}
        header={<ListHeader>Allocation List</ListHeader>}
        bordered
        dataSource={allocationList}
        renderItem={(item) => (
          <List.Item>
            <ListItemWrapper>
              <Link to={`${route.GROUPS}/${item.group.groupId}`}>
                {item.group.groupName}
              </Link>
              <Button
                type="link"
                onClick={() =>
                  showConfirmModal(item.allocationId, item.group.groupName)
                }
                style={{ marginLeft: 'auto' }}
                danger
              >
                Remove
              </Button>
            </ListItemWrapper>
          </List.Item>
        )}
      />
      <Modal
        title="Add Group"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="Group Name">
            <FlexContainer>
              <GroupSearchBar
                getAutoCompleteGroups={fetchAutoCompleteGroups}
                handleChange={handleChange}
                setCurrAutoCompleteGroup={setAutoCompGroupList}
                autoCompGroupList={autoCompGroupList}
              />
            </FlexContainer>
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  )
}

export default AllocationDetail
