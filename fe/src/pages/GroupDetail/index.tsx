import React, { useEffect, useMemo, useState } from 'react'
import { Button, Descriptions, Flex, List, Spin, Modal, Form } from 'antd'
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
} from '../../api/groupAPI'
import {
  Group,
  GroupPreferenceSlim,
  GroupPreferenceReqDTO,
} from '../../types/group'
import { roleNames } from '../../constant/role'
import Paragraph from 'antd/es/typography/Paragraph'
import api from '../../api/config'
import CandidateSearchBar from './components/CandidateSearchBar'
import AllocateProjectSearchBar from './components/AllocateProjectSearchBar'
import { UserProfileSlim } from '../../types/user'
import { ProjectProfileSlim } from '../../types/proj'
import { errHandler } from '../../utils/parse'
import { useGlobalComponentsContext } from '../../context/GlobalComponentsContext'
import { getUserById } from '../../api/userAPI'
import route from '../../constant/route'
import ModalGroupForm from './components/GroupEditModal'
import {
  updateGroupPreference,
  deleteGroupPreference,
} from '../../api/groupPreferenceAPI'
export type GroupDetailModalType = 'metaEdit' | 'allocation' | 'confirm'

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
  const [selectedUser, setSelectedUser] = useState<UserProfileSlim | null>(null)
  const [selectedProject, setSelectedProject] =
    useState<ProjectProfileSlim | null>(null)
  const { msg } = useGlobalComponentsContext()
  const members = useMemo(() => group?.groupMembers || [], [group])
  const isUserMember = useMemo(() => {
    if (!usrInfo) return false
    const userId = usrInfo.id
    return members.some((member) => member.id === userId)
  }, [members, usrInfo])

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
    const data = {
      group_id: Number(id),
      student_id: memberId,
    }
    try {
      console.log('Adding member with id:', memberId)
      console.log('Sending data:', data)
      const res = await api.post('/group_join/', data)
      console.log('Response from group_join:', res.data)
      msg.success('Member added successfully')
      await fetchGroupDetails()
    } catch (error) {
      console.error('Error adding member:', error)
      msg.err('Failed to add member')
    }
  }

  const handleAddProject = async (projectId: number) => {
    const currentMaxRank = Math.max(
      0,
      ...(group?.preferences || []).map((p) => p.rank)
    )
    const data: GroupPreferenceReqDTO[] = [
      {
        Preference: projectId,
        Rank: currentMaxRank + 1, // New rank
        // Group: Number(id),
      },
    ]
    try {
      console.log('Adding project with id:', projectId)
      console.log('Sending data:', data)
      const res = await updateGroupPreference(data, Number(id))
      console.log('Response from project_join:', res.data)
      msg.success('Project added successfully')
      await fetchGroupDetails()
    } catch (error) {
      console.error('Error adding project:', error)
      msg.err('Failed to add project')
    }
  }

  const handleAddProjectPreference = async () => {
    console.log('Selected Project:', selectedProject)
    if (selectedProject) {
      // await handleAddProject(selectedProject.id)
      fetchGroupDetails
      setSelectedProject(null) // Reset selected project to clear the search bar
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    const data = {
      group_id: Number(id),
      student_id: memberId,
    }
    try {
      console.log('成员id', memberId)
      console.log('删除', data)
      await leaveGroup(data)
      await fetchGroupDetails()
      msg.success('Member removed successfully')
    } catch (error) {
      console.error('Error removing member:', error)
      msg.err('Failed to remove member')
    }
  }

  const handleRemovePreference = async (preferenceId: number) => {
    try {
      console.log('delete preference删除', preferenceId)
      const res = await deleteGroupPreference(preferenceId)
      console.log('Response from deleteGroupPreference:', res.data)
      msg.success('Preference removed successfully')
      await fetchGroupDetails()
    } catch (error) {
      console.error('Error removing preference:', error)
      msg.err('Failed to remove preference')
    }
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

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
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
              {userRole == 'Student' && (
                <StyledButton type="primary" onClick={handleJoinOrLeaveGroup}>
                  {isUserMember ? 'Leave Group' : 'Join Group'}
                </StyledButton>
              )}
              <FlexContainer>
                <CandidateSearchBar
                  handleSelect={handleAddMember}
                  setSelectedUser={setSelectedUser}
                />
                <StyledButton
                  size="small"
                  type="primary"
                  onClick={() => {
                    console.log('Selected User:', selectedUser)
                    handleAddMember(selectedUser?.id || 0)
                  }}
                >
                  Add New Member
                </StyledButton>
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
              {userRole == 'Student' && (
                <StyledButton type="primary" onClick={handleJoinOrLeaveGroup}>
                  {isUserMember ? 'Leave Group' : 'Join Group'}
                </StyledButton>
              )}
            </Descriptions.Item>

            <Descriptions.Item span={3} label="Project Preferences">
              <FlexContainer>
                <AllocateProjectSearchBar
                  handleSelect={async (projectId: number) =>
                    await handleAddProject(projectId)
                  }
                  setSelectedProject={setSelectedProject}
                />
                <StyledButton
                  size="small"
                  type="primary"
                  onClick={handleAddProjectPreference}
                >
                  Add Project Preference
                </StyledButton>
              </FlexContainer>
              <List
                bordered
                style={{
                  maxHeight: '15rem',
                  overflow: 'auto',
                  marginTop: '1rem',
                }}
                dataSource={group?.preferences || []}
                renderItem={(member: GroupPreferenceSlim) => (
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
                        onClick={() =>
                          handleRemovePreference(member.preferenceId)
                        }
                      >
                        Remove
                      </StyledButton>,
                    ]}
                  >
                    No.{member.rank} {member.preference.name}
                  </List.Item>
                )}
              />
            </Descriptions.Item>
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
