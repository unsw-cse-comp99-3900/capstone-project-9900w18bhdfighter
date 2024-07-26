/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Typography, Upload, message } from 'antd'

import styled from 'styled-components'

import { submitSubmission } from '../../../../api/submissionAPI'

import { useEffect } from 'react'
import { useAuthContext } from '../../../../context/AuthContext'
import { useGlobalConstantContext } from '../../../../context/GlobalConstantContext'
import SubmissionTabProvider, {
  useSubmissionTabContext,
} from '../../../../context/SubmissionTabContext'
import { SubmissionReqDTO } from '../../../../types/submission'
import { timeFormat } from '../../../../utils/parse'
import { getThemeColor, getThemeToken } from '../../../../utils/styles'

const Wrapper = styled.div`
  padding: ${getThemeToken('paddingLG', 'px')};
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${getThemeToken('boxShadow')};
  height: calc(100vh - 10rem);
`
const _Form = styled(Form)`
  width: 100%;
  height: 100%;
  margin-top: 1rem;
  padding: ${getThemeToken('paddingMD', 'px')};
  border: 1px solid ${getThemeColor('grayscalePalette', 5)};
  background-color: ${getThemeColor('grayscalePalette', 1)};
`
const Strong = styled(Typography.Text)`
  font-weight: bold;
`
const _SubmissionTab = () => {
  const {
    participatedProject,
    submission,
    participatedGroup,
    getMySubmission,
  } = useSubmissionTabContext()
  const { PROJECT_DUE } = useGlobalConstantContext()
  console.log(submission)
  const { usrInfo } = useAuthContext()
  const [form] = Form.useForm()
  useEffect(() => {
    const submissionReport = submission?.submissionReport
      ? [
          {
            name: submission?.fileNameReport,
            url: submission?.submissionReport,
          },
        ]
      : []
    const submissionVideo = submission?.submissionDemoVideo
      ? [
          {
            name: submission?.fileNameDemo,
            url: submission?.submissionDemoVideo,
          },
        ]
      : []
    form.setFieldsValue({
      SubmissionDemoVideo: submissionVideo,
      SubmissionReport: submissionReport,
      GithubLink: submission?.githubLink,
    })
  }, [submission])
  const handleBeforeUpload = (
    file: File,
    _fileList: File[],
    type: 'report' | 'video'
  ) => {
    if (type === 'video' && file.type !== 'video/mp4') {
      message.error('You can only upload MP4 file!')
      return false
    }
    if (type === 'report' && file.type !== 'application/pdf') {
      message.error('You can only upload PDF file!')
      return false
    }

    return true
  }
  const handleBeforeVideoUpload = (file: File, fileList: File[]) => {
    return handleBeforeUpload(file, fileList, 'video')
  }

  const handleBeforeReportUpload = (file: File, fileList: File[]) => {
    return handleBeforeUpload(file, fileList, 'report')
  }
  const handleSubmit = async (values: any) => {
    console.log('values:', values)

    if (!participatedProject) {
      return
    }
    if (!participatedGroup) {
      return
    }
    if (!usrInfo) {
      return
    }

    const sdv = values.SubmissionDemoVideo || []
    const rp = values.SubmissionReport || []
    const demoVideo =
      sdv.length > 0 ? values.SubmissionDemoVideo[0]?.originFileObj : null
    const report =
      rp.length > 0 ? values.SubmissionReport[0]?.originFileObj : null

    const submissionReqDTO: SubmissionReqDTO = {
      Group: participatedGroup.groupId,
      Project: participatedProject.id,
      SubmissionDemoVideo: demoVideo,
      SubmissionReport: report,
      GithubLink: values.GithubLink || null,
      SubmitBy: usrInfo.id,
    }

    console.log('submissionReqDTO:', submissionReqDTO)

    try {
      await submitSubmission(submissionReqDTO)

      message.success('Submission successfully uploaded.')
      getMySubmission()
    } catch (error) {
      message.error('Failed to upload submission.')
      console.error('Error submitting submission:', error)
    }
  }

  return (
    <Wrapper>
      <Typography.Text>
        Deliver you work in group{' '}
        <Strong>{participatedGroup?.groupName}</Strong> for project{' '}
        <Strong>{participatedProject?.name}</Strong>
      </Typography.Text>{' '}
      {PROJECT_DUE && (
        <Typography.Text>
          Due by <Strong>{timeFormat(PROJECT_DUE)}</Strong>
        </Typography.Text>
      )}
      <_Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="SubmissionDemoVideo"
          label="Demo Video"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload beforeUpload={handleBeforeVideoUpload} maxCount={1}>
            <Button icon={<UploadOutlined />}>
              Click to Upload Demo Video
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="SubmissionReport"
          label="Report"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload beforeUpload={handleBeforeReportUpload} maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to Upload Report</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="GithubLink"
          label="GitHub Link"
          rules={[{ type: 'url', message: 'Please enter a valid URL!' }]}
        >
          <Input placeholder="https://github.com/example/repo" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {submission ? 'Update Submission' : 'Submit Submission'}
          </Button>
        </Form.Item>
      </_Form>
    </Wrapper>
  )
}

const SubmissionTab = () => {
  return (
    <SubmissionTabProvider>
      <_SubmissionTab />
    </SubmissionTabProvider>
  )
}

export default SubmissionTab
