import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Descriptions,
  Flex,
  List,
  Spin,
  Modal,
  Input,
  Form,
} from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import Link from 'antd/es/typography/Link'
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import {
  joinGroup,
  leaveGroup,
  getGroupDetailByGroupId,
  mapGroupDTOToGroup,
} from '../../api/groupAPI' // Import the joinGroup function
import { Group } from '../../types/group'
import { roleNames } from '../../constant/role'
import Paragraph from 'antd/es/typography/Paragraph'
import api from '../../api/config'
import CandidateSearchBar from './components/CandidateSearchBar'
import { UserProfileSlim } from '../../types/user'
import { errHandler } from '../../utils/parse'
import { useGlobalComponentsContext } from '../../context/GlobalComponentsContext'
import { getUserById } from '../../api/userAPI'
import route from '../../constant/route'
import ModalGroupForm from './components/GroupEditModal'

export type GroupDetailModalType = 'metaEdit' | 'allocation' | 'confirm'
// Mock API function
const fakeApiAllocateProject = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5
      if (isSuccess) {
        resolve('Project XYZ')
      } else {
        reject(new Error('Allocation failed'))
      }
    }, 2000)
  })
}

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`

const FlexContainer = styled(Flex)`
  align-items: center;
`

const StyledButton = styled(Button)`
  height: 32px; /* Adjust height to match input/select */
`

const StyledInput = styled(Input)`
  height: 32px; /* Adjust height to match button */
`

const StyledModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px; /* Adjust based on your design */
`

const StyledParagraph = styled.p`
  font-size: 16px; /* Adjust based on your design */
`

const DescriptionsContainer = styled.div`
  width: 100%;
  padding-bottom: 2rem; /* Add bottom padding */
  display: flex;
  justify-content: center; /* Center the table horizontally */
`

const InnerDescriptionsContainer = styled.div`
  width: 100%;
`
const EditWrapper = styled(Flex)`
  width: 100%;
  justify-content: flex-end;
`
const roleMap = roleNames

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { usrInfo } = useAuthContext()
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [creatorProfile, setCreatorProfile] = useState<{
    id: number
    fullName: string
  } | null>()
  const { msg } = useGlobalComponentsContext()
  const members = useMemo(() => group?.groupMembers || [], [group])
  const isUserMember = useMemo(() => {
    if (!usrInfo) return false
    const userId = usrInfo.id
    return members.some((member) => member.id === userId)
  }, [members, usrInfo])

  const [newProjectPreference, setNewProjectPreference] = useState<string>('')

  const [allocationResults, setAllocationResults] = useState<string | null>(
    null
  )
  const [allocationError, setAllocationError] = useState<string | null>(null)
  const [open, setOpen] = useState({
    detail: false,
    metaEdit: false,
    allocation: false,
    confirm: false,
  })
  const [form] = Form.useForm()
  const userRole = usrInfo ? roleMap[usrInfo.role] : undefined
  const hasProjectPreferencesAccess =
    userRole && ['coordinator', 'admin', 'tutor'].includes(userRole)

  const fetchGroupDetails = async () => {
    if (!id) return
    try {
      console.log('Fetching group details for group ID:', id)

      const res = await getGroupDetailByGroupId(Number(id))
      const res1 = await getUserById(res.data.CreatedBy)
      const groupData = res.data
      setCreatorProfile({
        id: res1.data.data.UserID,
        fullName: res1.data.data.FirstName + ' ' + res1.data.data.LastName,
      })
      setGroup(mapGroupDTOToGroup(groupData))
    } catch (e) {
      console.error('Error fetching group details:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroupDetails()
  }, [id])

  const handleAddMember = async (memberId: number) => {
    //todo: call add api
    console.log(memberId)

    await fetchGroupDetails()
  }

  const handleRemoveMember = async (memberId: number) => {
    //todo: call remove api
    console.log(memberId)
    await fetchGroupDetails()
  }

  const handleAddProjectPreference = async () => {
    //todo: call preference add api

    await fetchGroupDetails()
  }

  const handleJoinOrLeaveGroup = async () => {
    if (!usrInfo) return
    const data = {
      group_id: Number(id),
      student_id: usrInfo.id,
    }
    // Logic to leave the group
    try {
      await (isUserMember ? leaveGroup(data) : joinGroup(data))
      await fetchGroupDetails()
      msg.success('Leave successfully')
    } catch (error: unknown) {
      errHandler(
        error,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  const handleModalClose = (type: GroupDetailModalType) => {
    const dict = {
      metaEdit: () => setOpen({ ...open, metaEdit: false }),
      allocation: () => {
        setOpen({ ...open, allocation: false })
        setAllocationResults(null)
        setAllocationError(null)
      },
      confirm: () => setOpen({ ...open, confirm: false }),
    }
    dict[type]()
  }
  const handleModalOpen = (type: GroupDetailModalType) => {
    const dict = {
      metaEdit: () => setOpen({ ...open, metaEdit: true }),
      allocation: () => setOpen({ ...open, allocation: true }),
      confirm: () => setOpen({ ...open, confirm: true }),
    }
    dict[type]()
  }
  const handleAllocateProject = async () => {
    handleModalOpen('allocation')
    setAllocationResults(null)
    setAllocationError(null)
    try {
      const result = await fakeApiAllocateProject()
      setAllocationResults(`Project allocated: ${result}`)
    } catch (error) {
      setAllocationError('Project allocation failed. Please try again.')
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      // Send the form data to the backend
      await api.post('/api/savePreferences', values)
      msg.success('Preferences saved successfully')
      handleModalClose('metaEdit')
    } catch (error) {
      msg.err('Failed to save preferences')
    }
  }

  if (loading) {
    return (
      <Wrapper>
        <Spin tip="Loading..." />
      </Wrapper>
    )
  }
  console.log(group)

  return (
    <Wrapper>
      <Modal
        title="Confirm Save"
        open={open.confirm}
        onOk={handleSave}
        onCancel={() => handleModalClose('confirm')}
      >
        <Paragraph>
          Are you sure you want to submit your project preferences? Once
          submitted, they cannot be changed.
        </Paragraph>
      </Modal>
      <ModalGroupForm
        title="Edit Group Meta Data"
        isModalOpen={open.metaEdit}
        handleOk={handleSave}
        handleCancel={() => handleModalClose('metaEdit')}
        initialData={group || undefined}
      />
      <EditWrapper gap={10}>
        {/* 
        todo: 只给admin展示
        */}
        <Button type="primary" onClick={() => handleModalOpen('metaEdit')}>
          Edit Group Meta Data
        </Button>
      </EditWrapper>
      <DescriptionsContainer>
        <InnerDescriptionsContainer>
          <Descriptions bordered title="Group Detail">
            <Descriptions.Item span={1} label="Group Name">
              {group?.groupName}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Creator">
              <Link href={`${route.PROFILE}/${creatorProfile?.id}`}>
                {creatorProfile?.fullName}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Description">
              {group?.groupDescription}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Group Members">
              <FlexContainer>
                {/* todo: */}
                <CandidateSearchBar handleSelect={handleAddMember} />
              </FlexContainer>
              <List
                bordered
                style={{
                  maxHeight: '15rem',
                  overflow: 'auto',
                  marginTop: '1rem',
                }}
                dataSource={members}
                renderItem={(member: UserProfileSlim) => (
                  <List.Item
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    actions={[
                      <StyledButton
                        key="1"
                        size="small"
                        type="text"
                        danger
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </StyledButton>,
                    ]}
                  >
                    {member.firstName} {member.lastName}
                  </List.Item>
                )}
              />
              {usrInfo && userRole === 'student' && (
                <StyledButton type="primary" onClick={handleJoinOrLeaveGroup}>
                  {isUserMember ? 'Leave Group' : 'Join Group'}
                </StyledButton>
              )}
            </Descriptions.Item>
            {hasProjectPreferencesAccess && (
              <React.Fragment>
                <Descriptions.Item span={3} label="Project Preferences">
                  <FlexContainer>
                    <StyledInput
                      value={newProjectPreference}
                      onChange={(e) => setNewProjectPreference(e.target.value)}
                      placeholder="Add new project preference"
                      style={{ width: 200, marginRight: 10 }}
                    />
                    <StyledButton
                      size="small"
                      type="primary"
                      onClick={handleAddProjectPreference}
                    >
                      Add Project Preference
                    </StyledButton>
                  </FlexContainer>
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Actions">
                  <StyledButton type="primary" onClick={handleAllocateProject}>
                    Allocate Project
                  </StyledButton>
                </Descriptions.Item>
              </React.Fragment>
            )}
          </Descriptions>
        </InnerDescriptionsContainer>
      </DescriptionsContainer>

      <Modal
        title="Project Allocation"
        open={open.allocation}
        onCancel={() => handleModalClose('allocation')}
        footer={null}
      >
        <StyledModalContent>
          {allocationResults ? (
            <StyledParagraph>{allocationResults}</StyledParagraph>
          ) : allocationError ? (
            <StyledParagraph>{allocationError}</StyledParagraph>
          ) : (
            <Spin tip="Allocating projects..." />
          )}
        </StyledModalContent>
      </Modal>
    </Wrapper>
  )
}

export default GroupDetail
