import {
  Button,
  Descriptions,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Spin,
  Typography,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import Link from 'antd/es/typography/Link'
import React, { useEffect, useState } from 'react'
import { Link as _Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import {
  createOrUpdateGroupAsses,
  getGroupAssesByGroup,
} from '../../api/assesAPI'
import { staticWrapped } from '../../api/config'
import ResponsiveForm from '../../components/ResponsiveForm/ResponsiveForm'
import { role } from '../../constant/role'
import route from '../../constant/route'
import { useAuthContext } from '../../context/AuthContext'
import { useGlobalComponentsContext } from '../../context/GlobalComponentsContext'
import { GroupAss } from '../../types/groupAsses'
import { errHandler, timeFormat } from '../../utils/parse'
import { getThemeToken } from '../../utils/styles'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  padding: ${getThemeToken('paddingLG', 'px')};

  align-items: center;
  flex-direction: column;
`

const FormWrapper = styled(ResponsiveForm)`
  width: 100%;
  padding: ${getThemeToken('paddingMD', 'px')};
`

const FormItem = styled(Form.Item)``

interface AssessmentFormValues {
  score: number | undefined
  feedback: string | undefined
}

const AssessmentDetail: React.FC = () => {
  const [form] = useForm<AssessmentFormValues>()
  const [groupAsses, setGroupAsses] = useState<GroupAss | null>(null)
  const { msg } = useGlobalComponentsContext()
  const { id } = useParams()
  const { usrInfo, isInRoleRange } = useAuthContext()
  const [isOpened, setIsOpened] = useState(false)
  const toFetch = async () => {
    if (!id) return
    try {
      const res = await getGroupAssesByGroup(id)
      setGroupAsses(res)
      form.setFieldsValue({
        score: res.groupScore?.score,
        feedback: res.groupScore?.feedback,
      })
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  useEffect(() => {
    toFetch()
  }, [id])
  const handleOpenModal = () => {
    setIsOpened(true)
  }
  const showModal = () => {
    Modal.confirm({
      type: 'warning',
      title:
        'You are about to submit the assessment for this group. Are you sure?',

      onOk: async () => {
        if (!id) return
        if (!usrInfo) return

        try {
          const values = await form.validateFields()
          await createOrUpdateGroupAsses({
            group: parseInt(id),
            score: values.score as number,
            feedback: values.feedback as string,
            markers: usrInfo?.id,
          })
          await toFetch()
          setIsOpened(false)
          message.success('Score and feedback submitted successfully')
        } catch (error) {
          message.error('Submission failed')
        }
      },
      onCancel() {
        message.info('Submission cancelled')
      },
    })
  }

  if (!groupAsses)
    return (
      <Wrapper>
        <Spin />
      </Wrapper>
    )

  const sub = groupAsses.submission
  const NotProvided = () => (
    <Typography.Text type="secondary">Not Provided</Typography.Text>
  )
  const Unmark = () => (
    <Typography.Text type="secondary">Not Marked</Typography.Text>
  )
  const NotSubmit = () => (
    <Typography.Text type="secondary">Not Submitted</Typography.Text>
  )

  return (
    <Wrapper vertical>
      <Modal
        title="Assessment"
        open={isOpened}
        onCancel={() => setIsOpened(false)}
        onOk={showModal}
      >
        <FormWrapper name="assessment" form={form} layout="vertical">
          <FormItem
            label="Score"
            name="score"
            rules={[{ required: true, message: 'Please input the score!' }]}
          >
            <Input type="number" />
          </FormItem>

          <FormItem
            label="Feedback"
            name="feedback"
            rules={[{ required: true, message: 'Please provide feedback!' }]}
          >
            <Input.TextArea rows={4} />
          </FormItem>
        </FormWrapper>
      </Modal>
      <Flex
        style={{
          width: '100%',
          display: isInRoleRange([role.STUDENT]) ? 'none' : 'flex',
        }}
        justify="end"
      >
        <Button type="primary" onClick={handleOpenModal}>
          {groupAsses.groupScore ? 'Remark' : 'Mark'}
        </Button>
      </Flex>
      <Descriptions
        style={{ width: '100%' }}
        bordered
        title="Submission Details"
      >
        <Descriptions.Item label="Last Submit" span={3}>
          {sub?.submissionTime ? timeFormat(sub.submissionTime) : <NotSubmit />}
        </Descriptions.Item>
        <Descriptions.Item label="Demo Video" span={3}>
          {sub?.submissionDemoVideo ? (
            <Link href={staticWrapped(sub.submissionDemoVideo)}>
              {sub.fileNameDemo}
            </Link>
          ) : (
            <NotProvided />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Report" span={3}>
          {sub?.submissionReport ? (
            <Link href={staticWrapped(sub.submissionReport)}>
              {sub.fileNameReport}
            </Link>
          ) : (
            <NotProvided />
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Repo Link" span={3}>
          {sub?.githubLink ? (
            <Link href={sub.githubLink}>{sub.githubLink}</Link>
          ) : (
            <NotProvided />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Score" span={1}>
          {groupAsses.groupScore ? (
            groupAsses.groupScore.score + '/100'
          ) : (
            <Unmark />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Marked By" span={2}>
          {groupAsses.groupScore?.markedBy ? (
            <_Link to={`${route.PROFILE}/${groupAsses.groupScore.markedBy.id}`}>
              {groupAsses.groupScore.markedBy.firstName?.concat(
                ' ',
                groupAsses.groupScore.markedBy.lastName
              )}
            </_Link>
          ) : (
            <Unmark />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Feedback" span={3}>
          {groupAsses.groupScore?.feedback || <Unmark />}
        </Descriptions.Item>
      </Descriptions>
    </Wrapper>
  )
}

export default AssessmentDetail
