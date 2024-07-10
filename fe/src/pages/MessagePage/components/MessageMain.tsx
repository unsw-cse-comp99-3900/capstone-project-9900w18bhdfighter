import { Flex } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../../utils/styles'
import MessageHeader from './MessageHeader'
import MessageList from './MessageList'
import MessageInputArea from './MessageInputArea'

const MsgContainer = styled(Flex)`
  padding: ${getThemeToken('paddingMD', 'px')};
  width: 70%;
  height: 100%;
  flex-direction: column;
  align-items: center;
`
export const MessageMain = () => (
  <MsgContainer>
    <MessageHeader />
    <MessageList />
    <MessageInputArea />
  </MsgContainer>
)
