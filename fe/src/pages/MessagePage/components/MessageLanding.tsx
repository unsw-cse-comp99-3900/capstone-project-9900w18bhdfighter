import { Flex, Typography } from 'antd'
import { getThemeToken } from '../../../utils/styles'
import styled from 'styled-components'

const Wrapper = styled(Flex)`
  padding: ${getThemeToken('paddingLG', 'px')};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const MessageLanding = () => {
  return (
    <Wrapper>
      <Typography.Title level={3}>
        Select or Add a Contact to Start
      </Typography.Title>
    </Wrapper>
  )
}

export default MessageLanding
