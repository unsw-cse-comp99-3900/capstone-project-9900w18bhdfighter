import { Button, Flex, Typography, Upload } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../../../utils/styles'
import SubmissionTabProvider, {
  useSubmissionTabContext,
} from '../../../../context/SubmissionTabContext'

const Wrapper = styled(Flex)`
  padding: ${getThemeToken('paddingLG', 'px')};
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
`
const _SubmissionTab = () => {
  const { undueProjects, participatedProject } = useSubmissionTabContext()
  const project = undueProjects[0]
  const _project = participatedProject?.[0]

  return (
    <Wrapper>
      <Typography.Title level={3}>Submission</Typography.Title>
      <Typography.Title level={4}>{project?.name}</Typography.Title>
      <Typography.Title level={4}>{_project?.name}</Typography.Title>
      <Upload>
        <Button>Click to Upload</Button>
      </Upload>
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
