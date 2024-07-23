import { useState, useEffect } from 'react'
import {
  Button,
  Descriptions,
  Flex,
  List,
  Spin,
  Typography,
  Input,
  message,
  Modal,
} from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

import { roleNames } from '../../constant/role'

import CandidateSearchBar from './components/CandidateSearchBar'
import { UserProfileSlim } from '../../types/user'

import route from '../../constant/route'
import ModalGroupForm from './components/GroupEditModal'
import { getProjectById } from '../../api/projectAPI'
import {
  createOrUpdateSkillEval,
  getSkillEvalByGroup,
} from '../../api/groupAPI'
import { SkillEvalReqDTO } from '../../types/skillEval'
import GroupDetailContextProvider, {
  useGroupDetailContext,
} from '../../context/GroupDetailContext'
import PreferenceEditModal from './components/PreferenceEditModal'
import { useGlobalConstantContext } from '../../context/GlobalConstantContext'
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

const FlexContainer = styled(Flex)`
  align-items: center;
`
const FlexEditContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
`

const SkillEvaluationContainer = styled.div`
  padding-top: 5%;
  flex-direction: column;
  align-items: flex-start;
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

const DescriptionsContainer = styled.div`
  width: 100%;
  padding-bottom: 2rem;
  display: flex;
  justify-content: center;
`

const InnerDescriptionsContainer = styled.div`
  width: 100%;
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
  const { usrInfo } = useAuthContext()
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
  const { isDueGroupFormation } = useGlobalConstantContext()
  const [open, setOpen] = useState<Record<GroupDetailModalType, boolean>>({
    preference: false,
    metaEdit: false,
    confirm: false,
  })
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
  const [evaluationSubmitted, setEvaluationSubmitted] = useState(false)

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

          for (const evalData of evaluationData) {
            const response = await createOrUpdateSkillEval(
              Number(group?.groupId),
              evalData
            )
            message.success('Self evaluation created successfully!')
            console.log('Evaluation submitted:', response.data)
          }
          setEvaluationSubmitted(true) // Set the state to true after successful submission
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
              ${isDueGroupFormation ? '(Locked)' : ''}
              `}
            >
              <FlexEditContainer
                style={{
                  display: isDueGroupFormation ? 'none' : 'flex',
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
                      isUserInThisGroup &&
                        !evaluationSubmitted && ( // Hide button if evaluation is submitted
                          <StyledButton
                            key="1"
                            size="small"
                            type="link"
                            onClick={() =>
                              handleSkillEvaluationModal(
                                true,
                                pre.preference.id
                              )
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
                      'You cannot change your evaluation after submission',
                    onOk: () => {
                      setEvaluationSubmitted(true) // Hide button after evaluation is submitted
                    },
                  })
                }}
              >
                Submit Evaluation
              </StyleLeaveButton>
            </Descriptions.Item>
          </Descriptions>
        </InnerDescriptionsContainer>
      </DescriptionsContainer>
      <Modal
        title="Skill Evaluation"
        open={isSkillEvaluationModalOpen}
        onCancel={() => handleSkillEvaluationModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => handleSkillEvaluationModal(false)}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitEvaluation}>
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
              Project Detail: {skillEvaluationData.ProjectDescription}
            </Typography.Paragraph>
            <Typography.Title level={5}>Required Skills</Typography.Title>
            <List
              dataSource={skillEvaluationData.RequiredSkills}
              renderItem={({ Skill }) => {
                const score = evaluationScores[Skill.SkillID] || ''
                const comment = evaluationComments[Skill.SkillID] || ''
                return (
                  <List.Item style={{ width: '100%' }}>
                    <Typography.Paragraph style={{ width: '100%' }}>
                      <Typography.Title level={5}>Skill Name:</Typography.Title>{' '}
                      {Skill.SkillName}
                      <Typography.Title level={5}>Area:</Typography.Title>{' '}
                      {Skill.Area.AreaName}
                      <Typography.Title level={5}>
                        Score (0-10):
                      </Typography.Title>
                      <StyledInput
                        type="number"
                        min={0}
                        max={10}
                        value={score}
                        onChange={(e) =>
                          handleScoreChange(Skill.SkillID, e.target.value)
                        }
                      />
                      <Typography.Title level={5}>Comment:</Typography.Title>
                      <StyledTextArea
                        rows={2}
                        value={comment}
                        onChange={(e) =>
                          handleCommentChange(Skill.SkillID, e.target.value)
                        }
                      />
                    </Typography.Paragraph>
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
