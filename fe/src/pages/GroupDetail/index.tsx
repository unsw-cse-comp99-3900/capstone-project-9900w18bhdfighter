import React, { useEffect, useState } from 'react'
import {
  Button,
  Descriptions,
  Flex,
  List,
  Tag,
  Spin,
  Select,
  Modal,
  Input,
  message,
} from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import Link from 'antd/es/typography/Link'
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { AxiosError } from 'axios'
import {
  joinGroup,
  leaveGroup,
  getGroupDetailByGroupId,
} from '../../api/groupAPI' // Import the joinGroup function
import {
  Group,
  GroupLeaveDTO,
  GroupJoinDTO,
  GroupRspDTO,
} from '../../types/group'

interface ErrorResponse {
  error: string
}

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

const { Option } = Select
const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError !== undefined
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

const StyledSelect = styled(Select)`
  height: 32px; /* Adjust height to match button */
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
  max-width: 80%; /* Control the width of the table */
`

const roleMap: { [key: number]: string } = {
  1: 'student',
  2: 'coordinator',
  3: 'client',
  4: 'admin',
  5: 'tutor',
}

const potentialMembers = [
  'Potential Member 1',
  'Potential Member 2',
  'Potential Member 3',
  'Potential Member 4',
]

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { usrInfo } = useAuthContext()
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [members, setMembers] = useState<string[]>([])
  const [newMember, setNewMember] = useState<string | undefined>(undefined)
  const [isUserMember, setIsUserMember] = useState<boolean>(false)
  const [projectPreferences, setProjectPreferences] = useState<string[]>([
    'Project Preference 1',
    'Project Preference 2',
    'Project Preference 3',
  ])
  const [newProjectPreference, setNewProjectPreference] = useState<string>('')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [allocationResults, setAllocationResults] = useState<string | null>(
    null
  )
  const [allocationError, setAllocationError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const res = await getGroupDetailByGroupId(Number(id))
        const groupData: GroupRspDTO = res.data
        console.log('Group Details:', groupData)

        // 确保 GroupMembers 和 Preferences 存在并且是数组
        const groupMembers = Array.isArray(groupData.GroupMembers)
          ? groupData.GroupMembers.map((member) => ({
              id: member.UserID,
              firstName: member.FirstName,
              lastName: member.LastName,
              email: member.EmailAddress,
              role: member.UserRole,
            }))
          : []

        const preferences = Array.isArray(groupData.Preferences)
          ? groupData.Preferences.map((preference) => ({
              preferenceId: preference.PreferenceID,
              preference: {
                id: preference.Preference.ProjectID,
                name: preference.Preference.ProjectName,
                description: preference.Preference.ProjectDescription,
                owner: preference.Preference.ProjectOwner,
                maxNumOfGroup: preference.Preference.MaxNumOfGroup,
                requiredSkills: preference.Preference.RequiredSkills.map(
                  (skillRecord) => {
                    const skill = skillRecord.Skill
                    return {
                      skillId: skill.SkillID,
                      skillName: skill.SkillName,
                      area: {
                        id: skill.Area.AreaID,
                        name: skill.Area.AreaName,
                      },
                    }
                  }
                ),
                projectOwnerId: preference.Preference.projectOwner_id,
                createdBy: preference.Preference.CreatedBy,
              },
              rank: preference.Rank,
              lock: preference.Lock,
              groupId: preference.Group,
            }))
          : []

        // Map GroupRspDTO to Group
        const mappedGroup: Group = {
          groupId: groupData.GroupID,
          groupName: groupData.GroupName,
          groupDescription: groupData.GroupDescription,
          maxMemberNum: groupData.MaxMemberNum,
          groupMembers: groupMembers,
          groupOwner: groupData.GroupOwner,
          createdBy: groupData.CreatedBy,
          preferences: preferences,
        }

        setGroup(mappedGroup)
        setMembers(
          mappedGroup.groupMembers.map(
            (member) => `${member.firstName} ${member.lastName}`
          )
        )
        setLoading(false)

        // Check if the user is already a member of the group
        if (usrInfo) {
          const userIsMember = mappedGroup.groupMembers.some(
            (member) => member.id === usrInfo.id
          )
          setIsUserMember(userIsMember)
        }
      } catch (e) {
        console.error('Error fetching group details:', e)
        message.error('Failed to load group details')
        setLoading(false)
      }
    }
    fetchGroupDetails()
  }, [id, usrInfo])

  const handleAddMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember])
      setNewMember(undefined)
    }
  }

  const handleRemoveMember = (member: string) => {
    setMembers(members.filter((m) => m !== member))
  }

  const handleAddProjectPreference = () => {
    if (
      newProjectPreference &&
      !projectPreferences.includes(newProjectPreference)
    ) {
      setProjectPreferences([...projectPreferences, newProjectPreference])
      setNewProjectPreference('')
    }
  }

  const handleApproveProject = (project: string) => {
    Modal.confirm({
      title: 'Confirm Approval',
      content: `Are you sure you want to approve "${project}" as the project?`,
      onOk: () => {
        setSelectedProject(project)
      },
    })
  }

  const handleJoinOrLeaveGroup = async () => {
    if (isUserMember) {
      // Logic to leave the group
      if (usrInfo) {
        const fullName = `${usrInfo.firstName} ${usrInfo.lastName}`
        const data: GroupLeaveDTO = {
          group_id: Number(id),
          student_id: usrInfo.id,
        }
        try {
          console.log('Sending request to leave group with data:', data)
          const response = await leaveGroup(data)

          console.log('Response:', response)

          if (response.status === 201) {
            setMembers(members.filter((member) => member !== fullName))
            setIsUserMember(false)
            message.success('Leave successfully')
          }
        } catch (error: unknown) {
          if (isAxiosError(error)) {
            console.error('Error response data:', error.response?.data)
            console.error('Error response status:', error.response?.status)
            console.error('Error response headers:', error.response?.headers)
            const errorMessage =
              (error.response?.data as ErrorResponse)?.error ||
              'An unknown error occurred'
            message.error(errorMessage)
          } else if (error instanceof Error) {
            console.error('Error message:', error.message)
            message.error(error.message)
          } else {
            console.error('Unknown error:', error)
            message.error('An unknown error occurred')
          }
        }
      }
    } else {
      // Logic to join the group
      if (usrInfo) {
        const fullName = `${usrInfo.firstName} ${usrInfo.lastName}`
        const data: GroupJoinDTO = {
          group_id: Number(id),
          student_id: usrInfo.id,
        }
        try {
          console.log('Sending request to join group with data:', data)
          const response = await joinGroup(data)

          console.log('Response:', response)

          if (response.status === 201) {
            setMembers([...members, fullName])
            setIsUserMember(true)
            message.success('Join successfully')
          }
        } catch (error: unknown) {
          if (isAxiosError(error)) {
            console.error('Error response data:', error.response?.data)
            console.error('Error response status:', error.response?.status)
            console.error('Error response headers:', error.response?.headers)
            const errorMessage =
              (error.response?.data as ErrorResponse)?.error ||
              'An unknown error occurred'
            message.error(errorMessage)
          } else if (error instanceof Error) {
            console.error('Error message:', error.message)
            message.error(error.message)
          } else {
            console.error('Unknown error:', error)
            message.error('An unknown error occurred')
          }
        }
      }
    }
  }

  const handleAllocateProject = async () => {
    setIsModalOpen(true)
    setAllocationResults(null)
    setAllocationError(null)
    try {
      const result = await fakeApiAllocateProject()
      setAllocationResults(`Project allocated: ${result}`)
    } catch (error) {
      setAllocationError('Project allocation failed. Please try again.')
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setAllocationResults(null)
    setAllocationError(null)
  }

  const userRole = usrInfo ? roleMap[usrInfo.role] : undefined
  const hasProjectPreferencesAccess =
    userRole && ['coordinator', 'admin', 'tutor'].includes(userRole)

  if (loading) {
    return (
      <Wrapper>
        <Spin tip="Loading..." />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <DescriptionsContainer>
        <InnerDescriptionsContainer>
          <Descriptions bordered title="Group Detail">
            <Descriptions.Item span={3} label="Group Name">
              {group?.groupName}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Project Name">
              {selectedProject || 'No project selected'}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Owner">
              <Link href="/">Client</Link>
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Creator">
              <Link href="/">TUT</Link>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Description">
              {group?.groupDescription}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Possessed Skills">
              <Tag style={{ margin: '0.1rem' }} color="magenta">
                example
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Group Members">
              <FlexContainer>
                <StyledSelect
                  value={newMember}
                  onChange={(value) => setNewMember(value as string)}
                  placeholder="Select new member"
                  style={{ width: 200, marginRight: 10 }}
                >
                  {potentialMembers.map((member) => (
                    <Option key={member} value={member}>
                      {member}
                    </Option>
                  ))}
                </StyledSelect>
                <StyledButton
                  size="small"
                  type="primary"
                  onClick={handleAddMember}
                >
                  Add Member
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
                renderItem={(member: string) => (
                  <List.Item
                    actions={[
                      <StyledButton
                        key="1"
                        size="small"
                        type="primary"
                        onClick={() => handleRemoveMember(member)}
                      >
                        Remove
                      </StyledButton>,
                    ]}
                  >
                    {member}
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
                  <List
                    bordered
                    style={{
                      maxHeight: '15rem',
                      overflow: 'auto',
                      marginTop: '1rem',
                    }}
                    dataSource={projectPreferences}
                    renderItem={(project: string) => (
                      <List.Item
                        actions={[
                          <StyledButton
                            key="1"
                            size="small"
                            type="primary"
                            onClick={() => handleApproveProject(project)}
                          >
                            Approve
                          </StyledButton>,
                        ]}
                      >
                        {project}
                      </List.Item>
                    )}
                  />
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
        visible={isModalOpen}
        onCancel={handleModalClose}
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
