import React, { useEffect, useMemo, useState } from 'react'
import { Button, Descriptions, Flex, List, Spin, Modal } from 'antd'
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
  GroupReqDTO,
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
import { deleteGroupPreference } from '../../api/groupPreferenceAPI'
import { isAxiosError } from 'axios'
export type GroupDetailModalType = 'metaEdit' | 'allocation' | 'confirm'

const WrapperContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const Wrapper = styled(Flex)`
  width: 60%;
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
const StyledJoinButton = styled(Button)`
  height: 32px;
  margin-top: 2%;
  width: 100%;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const StyledSubmitButton = styled(Button)`
  height: 32px;
  margin-top: 2%;
  width: 100%;
`
const StyledSubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
  const [selectedProjects, setSelectedProjects] = useState<
    ProjectProfileSlim[]
  >([])
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

  const [isLock, setIsLock] = useState<boolean>(false) // Add isLock state
  // const [form] = Form.useForm()
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

      // Initialize selectedProjects with current group preferences
      const currentPreferences = groupData.Preferences.map((pref) => ({
        id: pref.PreferenceID,
        name: pref.Preference.ProjectName,
        owner: pref.Preference.ProjectOwner,
      }))
      setSelectedProjects(currentPreferences)

      // Update isLock state
      const allLocked = groupData.Preferences.every((pref) => pref.Lock)
      setIsLock(allLocked)
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
  const handleSelectProject = (project: ProjectProfileSlim) => {
    setSelectedProjects((prevProjects) => [...prevProjects, project])
    console.log('Selected Project:', project)
  }

  const handleAddProjectPreference = async () => {
    console.log('Selected Project:', selectedProject)
    if (selectedProject) {
      fetchGroupDetails
      setSelectedProject(null) // Reset selected project to clear the search bar
    }
  }
  const handleAddProjectPreferences = async () => {
    // 获取当前渲染的selectedProjects列表
    const data: GroupPreferenceReqDTO[] = selectedProjects.map(
      (project, index) => ({
        Rank: index + 1, // Rank based on selection order
        Preference: project.id,
        Group: group?.groupId,
      })
    )

    try {
      console.log('Adding projects:', data)
      const res = await api.put(`/api/groups/${id}/preferences`, data)
      console.log('Response from project preferences submit:', res)
      msg.success('Projects added successfully')
      await fetchGroupDetails()
      setSelectedProjects([]) // Clear the selected projects after submission
    } catch (error) {
      console.error('Error adding projects:', error)
      msg.err('Failed to add projects')
    }
  }

  const handleSubmitPreferenceClick = async () => {
    console.log('Button clicked')

    try {
      console.log('Submitting project preferences:')
      const res = await api.put(
        `/api/groups/${id}/preferences/submit`,
        group?.groupId
      )
      console.log('Response from project preferences submit:', res.data)
      msg.success('Projects submitted successfully')
      await fetchGroupDetails()
    } catch (error) {
      console.error('Error submitting projects:', error)
      msg.err('Failed to submit projects')
    }
  }

  const handleConfirmSubmit = () => {
    Modal.confirm({
      title: 'Confirm Submission',
      content: 'Are you sure you want to submit your project preferences?',
      onOk: handleSubmitPreferenceClick,
      onCancel() {
        console.log('Submission cancelled')
      },
    })
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

  const handleSaveMetadata = async (groupReqDTO: GroupReqDTO) => {
    try {
      console.log('sending group metadata', groupReqDTO)
      const response = await api.put(`/api/groups/${id}`, groupReqDTO)
      console.log('Response from API:', response)
      msg.success('Metadata saved successfully')
      handleModalClose('confirm')
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Error saving metadata:', error)
        msg.err(
          `Failed to save metadata: ${error.response?.data?.message || error.message}`
        )
      } else {
        console.error('Unexpected error saving metadata:', error)
        msg.err('An unexpected error occurred')
      }
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
    <WrapperContainer>
      <Wrapper>
        <Modal
          title="Confirm Save"
          open={open.confirm}
          onOk={() =>
            handleSaveMetadata({
              GroupName: '',
              GroupDescription: '',
              MaxMemberNumber: Number(),
            })
          }
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
          handleOk={handleSaveMetadata}
          handleCancel={() => handleModalClose('metaEdit')}
          initialData={group || undefined}
        />
        {/* student cannot edit group */}
        {userRole !== 'Student' && (
          <EditWrapper gap={10}>
            <Button type="primary" onClick={() => handleModalOpen('metaEdit')}>
              Edit Group Meta Data
            </Button>
          </EditWrapper>
        )}

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
                {userRole !== 'Student' && (
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
                )}
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
                        userRole !== 'Student' && (
                          <StyledButton
                            key="1"
                            size="small"
                            type="text"
                            danger
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Remove
                          </StyledButton>
                        ),
                      ]}
                    >
                      {member.firstName} {member.lastName}
                    </List.Item>
                  )}
                />
                {userRole == 'Student' && (
                  <ButtonContainer>
                    <StyledJoinButton
                      type="primary"
                      onClick={handleJoinOrLeaveGroup}
                    >
                      {isUserMember ? 'Leave Group' : 'Join Group'}
                    </StyledJoinButton>
                  </ButtonContainer>
                )}
              </Descriptions.Item>

              {userRole == 'Student' && (
                <Descriptions.Item span={3} label="Project Preferences for Stu">
                  {isUserMember && (
                    <FlexContainer>
                      {!isLock && (
                        <React.Fragment>
                          <AllocateProjectSearchBar
                            handleSelect={handleSelectProject}
                            setSelectedProject={setSelectedProject}
                          />
                          <StyledButton
                            size="small"
                            type="primary"
                            onClick={handleAddProjectPreferences}
                          >
                            Add Project Preference
                          </StyledButton>
                        </React.Fragment>
                      )}
                    </FlexContainer>
                  )}
                  <List
                    bordered
                    style={{
                      maxHeight: '15rem',
                      overflow: 'auto',
                      marginTop: '1rem',
                    }}
                    dataSource={selectedProjects}
                    renderItem={(project: ProjectProfileSlim) => (
                      <List.Item
                        key={project.id} // 确保每个列表项都有唯一的key
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        actions={[
                          !isLock && isUserMember && (
                            <StyledButton
                              key="1"
                              size="small"
                              type="text"
                              danger
                              onClick={() =>
                                setSelectedProjects((prevProjects) =>
                                  prevProjects.filter(
                                    (p) => p.id !== project.id
                                  )
                                )
                              }
                            >
                              Remove
                            </StyledButton>
                          ),
                        ]}
                      >
                        {project.name}
                      </List.Item>
                    )}
                  />
                  {isUserMember && !isLock && (
                    <StyledSubmitButtonWrapper>
                      <StyledSubmitButton onClick={handleConfirmSubmit}>
                        Submit
                      </StyledSubmitButton>
                    </StyledSubmitButtonWrapper>
                  )}
                </Descriptions.Item>
              )}

              {userRole !== 'Student' && (
                <Descriptions.Item span={3} label="Project Preferences">
                  <FlexContainer>
                    {!isLock && (
                      <React.Fragment>
                        <AllocateProjectSearchBar
                          handleSelect={handleSelectProject}
                          setSelectedProject={setSelectedProject}
                        />
                        <StyledButton
                          size="small"
                          type="primary"
                          onClick={handleAddProjectPreference}
                        >
                          Add Project Preference
                        </StyledButton>
                      </React.Fragment>
                    )}
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
                          !isLock && (
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
                            </StyledButton>
                          ),
                        ]}
                      >
                        No.{member.rank} {member.preference.name}
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
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
    </WrapperContainer>
  )
}

export default GroupDetail
