import { Flex } from 'antd'

import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import MessageSider from './components/MessageSider'
import MessageHeader from './components/MessageHeader'
import MessageList from './components/MessageList'
import MessageInputArea from './components/MessageInputArea'
import MessageContextProvider from '../../context/MessageContext'

const Wrapper = styled(Flex)`
  padding: ${getThemeToken('paddingLG', 'px')};
  width: 100%;
  height: 100%;
`
const Container = styled(Flex)`
  box-shadow: ${getThemeToken('boxShadow')};
`
const MsgContainer = styled(Flex)`
  padding: ${getThemeToken('paddingMD', 'px')};
  flex: 3;
  height: 100%;

  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const _MessagePage = () => {
  return (
    <Wrapper>
      <Container>
        <MessageSider />
        <MsgContainer>
          <MessageHeader />
          <MessageList />
          <MessageInputArea />
        </MsgContainer>
      </Container>
    </Wrapper>
  )
}

const MessagePage = () => {
  return (
    <MessageContextProvider>
      <_MessagePage />
    </MessageContextProvider>
  )
}

export default MessagePage
