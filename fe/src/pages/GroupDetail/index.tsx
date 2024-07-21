import { useState } from 'react'
import { Button, Descriptions, Flex, List, Modal, Spin, Typography } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

import { roleNames } from '../../constant/role'

import CandidateSearchBar from './components/CandidateSearchBar'
import { UserProfileSlim } from '../../types/user'

import route from '../../constant/route'
import ModalGroupForm from './components/GroupEditModal'
import api from '../../api/config'
import GroupDetailContextProvider, {
  useGroupDetailContext,
} from '../../context/GroupDetailContext'
import PreferenceEditModal from './components/PreferenceEditModal'
export type GroupDetailModalType = 'metaEdit' | 'preference' | 'confirm'

interface Area {
  AreaID: number
  AreaName: string
}

interface Skill {
  Area: Area
  SkillID: number
  SkillName: string
}

interface RequiredSkill {
  Skill: Skill
}

interface SkillEvaluationData {
  ProjectName: string
  ProjectDescription: string
  ProjectOwner: string
  RequiredSkills: RequiredSkill[]
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
const FlexEditContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between; /* Add this line */
`
const SkillEvaluationContainer = styled(Flex)`
  align-items: center;
`
const StyledEditButton = styled(Button)`
  height: 32px;
  margin-top: 2%;
  margin-left: auto;
`
const StyledButton = styled(Button)`
  height: 32px; /* Adjust height to match input/select */
`
const StyledJoinButton = styled(Button)`
  height: 32px;
  margin-top: 2%;
  width: 100%;
`
const StyleLeaveButton = styled(StyledJoinButton)``
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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

const _GroupDetail = () => {
  const { usrInfo } = useAuthContext()
  const {
    group,
    joinOrLeave,
    addMember,
    removeMember,
    isUserInGroup,
    creatorProfile,
    lockPreferences,
    isGroupPreferenceLocked,
    isUserInThisGroup,
    isThisGroupFull,
  } = useGroupDetailContext()

  const [open, setOpen] = useState<Record<GroupDetailModalType, boolean>>({
    preference: false,
    metaEdit: false,
    confirm: false,
  })
  // const [form] = Form.useForm()
  const [skillEvaluationData, setSkillEvaluationData] =
    useState<SkillEvaluationData | null>(null)
  const userRole = usrInfo ? roleMap[usrInfo.role] : undefined
  const [isSkillEvaluationModalOpen, setSkillEvaluationModalOpen] =
    useState(false)
  if (!group) {
    return (
      <Wrapper>
        <Spin tip="Loading..." />
      </Wrapper>
    )
  }

  const handleModal = (type: GroupDetailModalType, isOpen: boolean) => {
    setOpen((prev) => ({ ...prev, [type]: isOpen }))
  }

  const handleSkillEvaluationModal = async (isOpen: boolean, id?: number) => {
    setSkillEvaluationModalOpen(isOpen)
    if (isOpen && id) {
      // Fetch data from the backend when the modal is opened
      await api
        .get(`/projects/${id}/`)
        .then((response) => {
          console.log('Fetched skill evaluation data:', response.data)
          setSkillEvaluationData(response.data)
        })
        .catch((error) => {
          console.error('Error fetching skill evaluation data:', error)
        })
    } else {
      setSkillEvaluationData(null)
    }
  }

  return (
    <Wrapper>
      <ModalGroupForm
        title="Edit Group Meta Data"
        isModalOpen={open.metaEdit}
        handleCancel={() => handleModal('metaEdit', false)}
      />
      {/* student cannot edit group */}
      {userRole !== 'Student' && (
        <EditWrapper gap={10}>
          <Button type="primary" onClick={() => handleModal('metaEdit', true)}>
            Edit Group Meta Data
          </Button>
        </EditWrapper>
      )}

      <PreferenceEditModal
        open={open.preference}
        handleCancel={() => handleModal('preference', false)}
      />
      <DescriptionsContainer>
        <InnerDescriptionsContainer>
          <Descriptions bordered title="Group Detail">
            <Descriptions.Item span={1} label="Group Name">
              {group?.groupName}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Creator">
              <Link to={`${route.PROFILE}/${creatorProfile?.id}`}>
                {creatorProfile?.fullName}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Description">
              {group?.groupDescription}
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              label={`Members (${group.groupMembers.length}/${
                group.maxMemberNum
              })`}
            >
              {userRole !== 'Student' && (
                <FlexContainer>
                  <CandidateSearchBar handleSelect={(val) => addMember(val)} />
                </FlexContainer>
              )}
              <List
                bordered
                style={{
                  maxHeight: '15rem',
                  overflow: 'auto',
                  marginTop: '1rem',
                }}
                dataSource={group.groupMembers}
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
                          onClick={() => removeMember(member.id)}
                        >
                          Remove
                        </StyledButton>
                      ),
                    ]}
                  >
                    <Link to={`${route.PROFILE}/${member.id}`}>
                      {member.firstName} {member.lastName}
                    </Link>
                  </List.Item>
                )}
              />

              <ButtonContainer
                style={{
                  display: userRole === 'Student' ? 'flex' : 'none',
                }}
              >
                <StyledJoinButton
                  style={{
                    display:
                      //不在这个组里，也不在其他组里才显示,并且这个组没满
                      !isUserInThisGroup && !isUserInGroup && !isThisGroupFull
                        ? 'block'
                        : 'none',
                  }}
                  type="primary"
                  onClick={joinOrLeave}
                >
                  Join Group
                </StyledJoinButton>
                <StyleLeaveButton
                  style={{
                    //在这个组里，就显示leave
                    display: isUserInThisGroup ? 'block' : 'none',
                  }}
                  type="primary"
                  onClick={joinOrLeave}
                >
                  Leave Group
                </StyleLeaveButton>
              </ButtonContainer>
            </Descriptions.Item>

            <Descriptions.Item
              span={3}
              label={`Project Preferences
              ${isGroupPreferenceLocked ? '(Locked)' : ''}
              `}
            >
              <FlexEditContainer
                style={{
                  display: isGroupPreferenceLocked ? 'none' : 'flex',
                }}
              >
                <StyledEditButton
                  onClick={() => handleModal('preference', true)}
                >
                  Edit Preferences
                </StyledEditButton>
              </FlexEditContainer>

              <List
                bordered
                style={{
                  maxHeight: '15rem',
                  overflow: 'auto',
                  marginTop: '1rem',
                }}
                dataSource={group.preferences}
                renderItem={(pre) => (
                  <List.Item
                    key={pre.preferenceId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    actions={[
                      isUserInThisGroup && (
                        <StyledButton
                          key="1"
                          size="small"
                          type="link"
                          onClick={() =>
                            handleSkillEvaluationModal(true, pre.preference.id)
                          }
                        >
                          Skill Evaluation
                        </StyledButton>
                      ),
                    ]}
                  >
                    <Link to={`${route.PROJECTS}/${pre.preference.id}`}>
                      {pre.preference.name}
                    </Link>
                  </List.Item>
                )}
              />
              <StyleLeaveButton
                style={{
                  display: group.preferences.length === 0 ? 'none' : 'block',
                }}
                onClick={() => {
                  Modal.confirm({
                    title: 'Are you sure you want to submit?',
                    content:
                      'You cannot change your preferences after submission',
                    onOk: () => {
                      lockPreferences()
                    },
                  })
                }}
              >
                Submit
              </StyleLeaveButton>
            </Descriptions.Item>
          </Descriptions>
        </InnerDescriptionsContainer>
      </DescriptionsContainer>
      <Modal
        title="Skill Evaluation"
        visible={isSkillEvaluationModalOpen}
        onCancel={() => handleSkillEvaluationModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => handleSkillEvaluationModal(false)}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary">
            Submit
          </Button>,
        ]}
      >
        {skillEvaluationData ? (
          <SkillEvaluationContainer>
            <Typography.Title level={4}>
              {skillEvaluationData.ProjectName}
            </Typography.Title>
            <Typography.Paragraph strong>
              Owner: {skillEvaluationData.ProjectOwner}
            </Typography.Paragraph>
            <Typography.Paragraph>
              {skillEvaluationData.ProjectDescription}
            </Typography.Paragraph>
            <Typography.Title level={5}>Required Skills</Typography.Title>
            <List
              dataSource={skillEvaluationData.RequiredSkills}
              renderItem={({ Skill }) => (
                <List.Item>
                  <Typography.Paragraph>
                    <Typography.Title>Skill Name:</Typography.Title>{' '}
                    {Skill.SkillName}
                    <Typography.Title>Area:</Typography.Title>{' '}
                    {Skill.Area.AreaName}
                  </Typography.Paragraph>
                </List.Item>
              )}
            />
          </SkillEvaluationContainer>
        ) : (
          <Spin tip="Loading..." />
        )}
      </Modal>
    </Wrapper>
  )
}

const GroupDetail = () => (
  <GroupDetailContextProvider>
    <_GroupDetail />
  </GroupDetailContextProvider>
)
export default GroupDetail
