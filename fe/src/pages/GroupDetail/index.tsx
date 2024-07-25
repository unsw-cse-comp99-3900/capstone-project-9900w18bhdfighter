import {
  Button,
  Descriptions,
  Flex,
  Input,
  List,
  message,
  Modal,
  Spin,
  Typography,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAuthContext } from '../../context/AuthContext'
import { getThemeToken } from '../../utils/styles'

import { role, roleNames } from '../../constant/role'

import { UserProfileSlim } from '../../types/user'
import CandidateSearchBar from './components/CandidateSearchBar'

import {
  createOrUpdateSkillEval,
  getSkillEvalByGroup,
} from '../../api/groupAPI'
import { getProjectById } from '../../api/projectAPI'
import route from '../../constant/route'

import { useGlobalConstantContext } from '../../context/GlobalConstantContext'
import { useGlobalTheme } from '../../context/GlobalThemeContext'
import GroupDetailContextProvider, {
  useGroupDetailContext,
} from '../../context/GroupDetailContext'
import { SkillEvalReqDTO } from '../../types/skillEval'
import { timeFormat } from '../../utils/parse'
import ModalGroupForm from './components/GroupEditModal'
import PreferenceEditModal from './components/PreferenceEditModal'
export type GroupDetailModalType = 'metaEdit' | 'preference' | 'confirm'

const { TextArea } = Input
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

const Title = styled(Typography.Text)`
  font-size: 1.2rem;
`
const Header = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: end;
  padding: ${getThemeToken('paddingMD', 'px')};
`
const FlexContainer = styled(Flex)`
  align-items: center;
`
const FlexEditContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
`

const SkillEvaluationContainer = styled.div`
  padding: ${getThemeToken('paddingMD', 'px')};
  width: 100%;
`

const StyledEditButton = styled(Button)`
  height: 32px;
  margin-top: 2%;
  margin-left: auto;
`
const StyledButton = styled(Button)`
  height: 32px;
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

const DescriptionsContainer = styled(Descriptions)`
  box-shadow: ${getThemeToken('boxShadow')};
  overflow: auto;
  max-height: 100%;
`

const EditWrapper = styled(Flex)`
  width: 100%;
  justify-content: flex-end;
`

const StyledInput = styled(Input)`
  margin-bottom: 1rem;
`

const StyledTextArea = styled(TextArea)`
  margin-bottom: 1rem;
`

const roleMap = roleNames

const _GroupDetail = () => {
  const { usrInfo, isInRoleRange } = useAuthContext()
  const {
    group,
    joinOrLeave,
    addMember,
    removeMember,
    isUserInGroup,
    creatorProfile,
    isUserInThisGroup,
    isThisGroupFull,
  } = useGroupDetailContext()
  const { isDueGroupFormation, GROUP_FORMATION_DUE } =
    useGlobalConstantContext()
  const [open, setOpen] = useState<Record<GroupDetailModalType, boolean>>({
    preference: false,
    metaEdit: false,
    confirm: false,
  })
  const { onWidth } = useGlobalTheme()

  const showPreferenceEdit = useMemo(() => {
    if (isInRoleRange([role.ADMIN, role.CORD, role.TUTOR])) {
      return true
    }
    if (
      isInRoleRange([role.STUDENT]) &&
      isUserInThisGroup &&
      !isDueGroupFormation
    ) {
      return true
    }
    return false
  }, [isUserInThisGroup, isInRoleRange])
  const showMetaEdit = isInRoleRange([role.ADMIN, role.CORD, role.TUTOR])
  const showSearchBar = isInRoleRange([role.ADMIN, role.CORD, role.TUTOR])
  const [skillEvaluationData, setSkillEvaluationData] =
    useState<SkillEvaluationData | null>(null)
  const userRole = usrInfo ? roleMap[usrInfo.role] : undefined
  const [isSkillEvaluationModalOpen, setSkillEvaluationModalOpen] =
    useState(false)
  const [evaluationScores, setEvaluationScores] = useState<
    Record<number, number>
  >({})
  const [evaluationComments, setEvaluationComments] = useState<
    Record<number, string>
  >({})
  const [skillEvaluations, setSkillEvaluations] = useState<
    SkillEvalReqDTO[] | null
  >(null)

  useEffect(() => {
    if (skillEvaluations) {
      const scores: Record<number, number> = {}
      const comments: Record<number, string> = {}

      skillEvaluations.forEach((evalData) => {
        scores[evalData.Skill] = evalData.Score
        comments[evalData.Skill] = evalData.Note
      })

      setEvaluationScores(scores)
      setEvaluationComments(comments)
    }
  }, [skillEvaluations])

  const handleScoreChange = (skillId: number, value: string) => {
    setEvaluationScores((prev) => ({
      ...prev,
      [skillId]: Number(value),
    }))
  }

  const handleSubmitEvaluation = () => {
    Modal.confirm({
      title: 'Confirm Submission',
      content: 'Are you sure you want to submit your evaluation?',
      onOk: async () => {
        try {
          const evaluationData: SkillEvalReqDTO[] = Object.keys(
            evaluationScores
          ).map((skillId) => {
            const score = evaluationScores[Number(skillId)]
            if (score === undefined) {
              throw new Error(`Score for skillId ${skillId} is undefined`)
            }

            return {
              Note: evaluationComments[Number(skillId)] || '',
              Score: score,
              Skill: Number(skillId),
            }
          })

          const updatePromises = evaluationData.map((evalData) =>
            createOrUpdateSkillEval(Number(group?.groupId), evalData)
          )

          await Promise.all(updatePromises)

          message.success('Evaluation submitted successfully!')
          setSkillEvaluationModalOpen(false)
        } catch (error) {
          console.error('Error submitting evaluation:', error)
        }
      },
    })
  }

  if (!group) {
    return (
      <Wrapper>
        <Spin tip="Loading..." />
      </Wrapper>
    )
  }

  const handleCommentChange = (skillId: number, value: string) => {
    setEvaluationComments((prev) => ({
      ...prev,
      [skillId]: value,
    }))
  }

  const handleModal = (type: GroupDetailModalType, isOpen: boolean) => {
    setOpen((prev) => ({ ...prev, [type]: isOpen }))
  }

  const handleSkillEvaluationModal = async (isOpen: boolean, id?: number) => {
    setSkillEvaluationModalOpen(isOpen)
    if (isOpen && id) {
      try {
        const response = await getProjectById(id)
        console.log('Fetched skill evaluation data:', response.data)
        setSkillEvaluationData(response.data)

        const skillEvalResponse = await getSkillEvalByGroup(group.groupId)
        console.log('Skill evaluation data by group:', skillEvalResponse.data)
        console.log('DUE', isDueGroupFormation)
        setSkillEvaluations(skillEvalResponse.data)
      } catch (error) {
        console.error('Error fetching skill evaluation data:', error)
      }
    } else {
      setSkillEvaluationData(null)
      setSkillEvaluations(null)
    }
  }

  return (
    <Wrapper>
      <ModalGroupForm
        title="Edit Group Meta Data"
        isModalOpen={open.metaEdit}
        handleCancel={() => handleModal('metaEdit', false)}
      />

      <PreferenceEditModal
        open={open.preference}
        handleCancel={() => handleModal('preference', false)}
      />
      <Header>
        <Flex
          vertical
          style={{
            width: '100%',
          }}
        >
          <Title strong>
            Group Detail {isUserInThisGroup ? '(My Group)' : ''}
          </Title>
          <Typography.Text
            style={{
              display: isInRoleRange([role.STUDENT]) ? 'block' : 'none',
              fontSize: '0.8rem',
            }}
            type="warning"
          >
            {GROUP_FORMATION_DUE && !isDueGroupFormation
              ? `Note: Please form your group before ${timeFormat(GROUP_FORMATION_DUE)}`
              : ''}
          </Typography.Text>
          <Typography.Text
            style={{
              display: isInRoleRange([role.STUDENT]) ? 'block' : 'none',
              fontSize: '0.8rem',
            }}
            type="danger"
          >
            {isDueGroupFormation
              ? `Note: Group formation is locked. No more changes allowed.
                    `
              : ''}
          </Typography.Text>
        </Flex>
        {userRole !== 'Student' && (
          <EditWrapper gap={10}>
            <Button
              style={{
                visibility: showMetaEdit ? 'visible' : 'hidden',
              }}
              type="primary"
              onClick={() => handleModal('metaEdit', true)}
            >
              Edit Group Meta Data
            </Button>
          </EditWrapper>
        )}
      </Header>
      <DescriptionsContainer
        bordered
        style={{
          width: onWidth({
            xs: 'unset',
            defaultValue: '100%',
          }),
        }}
        size={onWidth({
          xs: 'small',
          defaultValue: 'default',
        })}
      >
        <Descriptions.Item span={1} label="Group Name">
          {group?.groupName}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Creator">
          <Link to={`${route.PROFILE}/${creatorProfile?.id}`}>
            {creatorProfile?.fullName}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Course">
          {group?.course.courseName}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Description">
          {group?.groupDescription}
        </Descriptions.Item>
        <Descriptions.Item
          span={3}
          label={`Members (${group.groupMembers.length}/${
            group.maxMemberNum
          }) ${isDueGroupFormation ? '(Locked)' : ''}
              `}
        >
          {showSearchBar && (
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

          {!isDueGroupFormation && (
            <ButtonContainer
              style={{
                display: userRole === 'Student' ? 'flex' : 'none',
              }}
            >
              <StyledJoinButton
                style={{
                  display:
                    !isUserInThisGroup && !isUserInGroup && !isThisGroupFull
                      ? 'block'
                      : 'none',
                }}
                type="primary"
                onClick={() => joinOrLeave('join')}
              >
                Join Group
              </StyledJoinButton>
              <StyleLeaveButton
                style={{
                  display: isUserInThisGroup ? 'block' : 'none',
                }}
                type="primary"
                onClick={() => joinOrLeave('leave')}
              >
                Leave Group
              </StyleLeaveButton>
            </ButtonContainer>
          )}
        </Descriptions.Item>

        <Descriptions.Item
          span={3}
          label={`Project Preferences
              ${isDueGroupFormation ? '(Locked)' : ''}
              `}
        >
          <FlexEditContainer
            style={{
              display: showPreferenceEdit ? 'flex' : 'none',
            }}
          >
            <StyledEditButton onClick={() => handleModal('preference', true)}>
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
                    // Hide button if evaluation is submitted
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
        </Descriptions.Item>
      </DescriptionsContainer>

      <Modal
        title={`Skill Evaluation for ${skillEvaluationData?.ProjectName}`}
        open={isSkillEvaluationModalOpen}
        bodyProps={{
          style: {
            maxHeight: '70vh',
            overflowY: 'auto',
          },
        }}
        onCancel={() => handleSkillEvaluationModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => handleSkillEvaluationModal(false)}
          >
            Cancel
          </Button>,
          <Button
            style={{
              display: isDueGroupFormation ? 'none' : 'block',
            }}
            key="submit"
            type="primary"
            onClick={handleSubmitEvaluation}
          >
            Submit
          </Button>,
        ]}
      >
        {skillEvaluationData ? (
          <SkillEvaluationContainer>
            <List
              dataSource={skillEvaluationData.RequiredSkills}
              renderItem={({ Skill }) => {
                const score = evaluationScores[Skill.SkillID] || ''
                const comment = evaluationComments[Skill.SkillID] || ''
                return (
                  <List.Item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography.Text style={{ width: '100%' }} strong>
                      {Skill.SkillName} - {Skill.Area.AreaName}
                    </Typography.Text>

                    <Typography.Text strong style={{ width: '100%' }}>
                      Score (0-10):
                    </Typography.Text>
                    <StyledInput
                      type="number"
                      min={0}
                      disabled={isDueGroupFormation}
                      max={10}
                      value={score}
                      onChange={(e) =>
                        handleScoreChange(Skill.SkillID, e.target.value)
                      }
                    />
                    <Typography.Text strong>Comment:</Typography.Text>
                    <StyledTextArea
                      maxLength={255}
                      showCount
                      rows={3}
                      disabled={isDueGroupFormation}
                      value={comment}
                      onChange={(e) =>
                        handleCommentChange(Skill.SkillID, e.target.value)
                      }
                    />
                  </List.Item>
                )
              }}
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
