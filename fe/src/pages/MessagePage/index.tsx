import { Flex } from 'antd'

import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import _MessageSider from './components/MessageSider'
import MessageHeader from './components/MessageHeader'
import MessageList from './components/MessageList'
import MessageInputArea from './components/MessageInputArea'
import MessageContextProvider from '../../context/MessageContext'
import { Outlet } from 'react-router-dom'

const Wrapper = styled(Flex)`
  padding: ${getThemeToken('paddingLG', 'px')};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Container = styled(Flex)`
  box-shadow: ${getThemeToken('boxShadow')};
  width: 100%;
  height: 100%;
  max-width: 60rem;
  min-width: 40rem;
`
const MsgContainer = styled(Flex)`
  padding: ${getThemeToken('paddingMD', 'px')};
  width: 70%;
  height: 100%;
  flex-direction: column;
  align-items: center;
`
const MsgSider = styled(_MessageSider)`
  padding: ${getThemeToken('paddingLG', 'px')};
  width: 30%;
  height: 100%;
  flex-direction: column;
  align-items: center;
`
const _MessagePage = () => {
  return (
    <Wrapper>
      <Container>
        <MsgSider />
        <Outlet />
      </Container>
    </Wrapper>
  )
}
export const MessageMain = () => (
  <MsgContainer>
    <MessageHeader />
    <MessageList />
    <MessageInputArea />
  </MsgContainer>
)
const MessagePage = () => {
  return (
    <MessageContextProvider>
      <_MessagePage />
    </MessageContextProvider>
  )
}

export default MessagePage
