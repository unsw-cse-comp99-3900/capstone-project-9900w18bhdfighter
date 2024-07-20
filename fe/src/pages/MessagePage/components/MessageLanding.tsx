import { Flex, Typography } from 'antd'
import { getThemeToken } from '../../../utils/styles'
import styled from 'styled-components'

const Wrapper = styled(Flex)`
  padding: ${getThemeToken('paddingLG', 'px')};
  justify-content: center;
  align-items: start;
  width: 100%;
  height: 100%;
  padding-top: 10%;
`

const MessageLanding = () => {
  return (
    <Wrapper>
      <Typography.Paragraph type="secondary">
        Select or Add a Contact to Start.
      </Typography.Paragraph>
    </Wrapper>
  )
}

export default MessageLanding
