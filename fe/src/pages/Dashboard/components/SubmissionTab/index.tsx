import { Button, Flex, Typography, Upload } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../../../utils/styles'
import SubmissionTabProvider, {
  useSubmissionTabContext,
} from '../../../../context/SubmissionTabContext'
import { useGlobalConstantContext } from '../../../../context/GlobalConstantContext'
import { daysFromTime, timeFormat } from '../../../../utils/parse'

const Wrapper = styled(Flex)`
  padding: ${getThemeToken('paddingLG', 'px')};
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  box-shadow: ${getThemeToken('boxShadow')};
  height: calc(100vh - 10rem);
`
const _SubmissionTab = () => {
  const { participatedProject } = useSubmissionTabContext()
  const { PROJECT_DUE } = useGlobalConstantContext()
  return (
    <Wrapper>
      <Typography.Title level={3}>Submission</Typography.Title>
      <Typography.Title level={4}>{participatedProject?.name}</Typography.Title>
      <Typography.Text>
        {PROJECT_DUE && timeFormat(PROJECT_DUE)}
      </Typography.Text>
      <Typography.Text>
        {PROJECT_DUE && daysFromTime(PROJECT_DUE)} days left
      </Typography.Text>
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
