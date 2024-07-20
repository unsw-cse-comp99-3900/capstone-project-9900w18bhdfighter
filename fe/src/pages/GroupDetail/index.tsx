import { useState } from 'react'
import { Button, Descriptions, Flex, List, Modal, Spin } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

import { roleNames } from '../../constant/role'

import CandidateSearchBar from './components/CandidateSearchBar'
import { UserProfileSlim } from '../../types/user'

import route from '../../constant/route'
import ModalGroupForm from './components/GroupEditModal'

import GroupDetailContextProvider, {
  useGroupDetailContext,
} from '../../context/GroupDetailContext'
import PreferenceEditModal from './components/PreferenceEditModal'
export type GroupDetailModalType = 'metaEdit' | 'preference' | 'confirm'

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
  } = useGroupDetailContext()

  const [open, setOpen] = useState<Record<GroupDetailModalType, boolean>>({
    preference: false,
    metaEdit: false,
    confirm: false,
  })
  // const [form] = Form.useForm()
  const userRole = usrInfo ? roleMap[usrInfo.role] : undefined

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
            <Descriptions.Item span={3} label="Group Members">
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
                    {member.firstName} {member.lastName}
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
                      //不在这个组里，也不在其他组里才显示
                      !isUserInThisGroup && !isUserInGroup ? 'block' : 'none',
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

            <Descriptions.Item span={3} label="Project Preferences">
              <FlexContainer
                style={{
                  display: isGroupPreferenceLocked ? 'none' : 'flex',
                }}
              >
                <Button onClick={() => handleModal('preference', true)}>
                  Edit Preferences
                </Button>
                <Button
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
                </Button>
              </FlexContainer>

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
                    // todo : skill evaluation modal
                    actions={[
                      isUserInThisGroup && (
                        <StyledButton key="1" size="small" type="link">
                          Skill Evaluation
                        </StyledButton>
                      ),
                    ]}
                  >
                    {pre.preference.name}
                  </List.Item>
                )}
              />
            </Descriptions.Item>
          </Descriptions>
        </InnerDescriptionsContainer>
      </DescriptionsContainer>
    </Wrapper>
  )
}

const GroupDetail = () => (
  <GroupDetailContextProvider>
    <_GroupDetail />
  </GroupDetailContextProvider>
)
export default GroupDetail
