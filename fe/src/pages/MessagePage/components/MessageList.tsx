import React from 'react'
import { getThemeColor, getThemeToken } from '../../../utils/styles'
import { Flex } from 'antd'
import styled, { useTheme } from 'styled-components'
import { Msg } from '../../../types/msg'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding-top: ${getThemeToken('paddingMD', 'px')};
  align-items: center;
  overflow-y: auto;
`
const Message = styled.div`
  background-color: ${getThemeColor('basicBg')};
  margin: 0.5rem;
  padding: 0.5rem;
  max-width: 50%;
  word-wrap: break-word;
`

const msgList: Msg[] = [
  {
    senderId: 1,
    senderName: 'TUT',
    content: 'Hello',
    msgId: 1,
  },
  {
    senderId: 2,
    senderName: 'STU',
    content: 'Hello',
    msgId: 2,
  },
  {
    senderId: 1,
    senderName: 'TUT',
    content: 'Hello',
    msgId: 3,
  },
  {
    senderId: 2,
    senderName: 'STU',
    content: `
  HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello
  HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello
  HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello

  
  `,
    msgId: 4,
  },
  {
    senderId: 1,
    senderName: 'STU',
    content: 'Hello',
    msgId: 5,
  },
]

const MessageList = () => {
  const theme = useTheme()
  return (
    <Wrapper>
      {msgList.map((msg) => (
        <Message
          style={{
            alignSelf: msg.senderId === 1 ? 'flex-start' : 'flex-end',
            backgroundColor:
              msg.senderId === 1
                ? theme.themeColor.basicBg
                : theme.themeColor.highlightSecondary,
          }}
          key={msg.msgId}
        >
          {msg.content}
        </Message>
      ))}
    </Wrapper>
  )
}

export default MessageList
