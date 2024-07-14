import { getThemeColor, getThemeToken } from '../../../utils/styles'

import styled, { useTheme } from 'styled-components'
import { useMessageContext } from '../../../context/MessageContext'
import { useAuthContext } from '../../../context/AuthContext'
import { useEffect, useRef } from 'react'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: ${getThemeToken('paddingMD', 'px')};
  align-items: center;
  overflow-y: auto;
`
const Message = styled.div`
  background-color: ${getThemeColor('basicBg')};
  box-sizing: border-box;
  margin: 0.5rem;
  padding: 0.5rem;
  max-width: 50%;

  word-wrap: break-word;
`
const ScrollEnd = styled.div``
const MessageList = () => {
  const theme = useTheme()
  const { currConversation } = useMessageContext()
  const { usrInfo } = useAuthContext()
  const msgList = currConversation?.messages || []
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [Boolean(msgList.length)])

  useEffect(() => {
    if (msgList[msgList.length - 1]?.senderId === usrInfo?.id) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [msgList])
  return (
    <Wrapper>
      {msgList.map((msg) => (
        <Message
          style={{
            alignSelf: msg.senderId === usrInfo?.id ? 'flex-end' : 'flex-start',
            backgroundColor:
              msg.senderId === usrInfo?.id
                ? theme.themeColor.basicBg
                : theme.themeColor.highlightSecondary,
          }}
          key={msg.createdAt}
        >
          {msg.content}
        </Message>
      ))}
      <ScrollEnd ref={messagesEndRef}></ScrollEnd>
    </Wrapper>
  )
}

export default MessageList
