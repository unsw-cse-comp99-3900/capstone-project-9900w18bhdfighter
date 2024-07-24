import { getThemeToken } from '../../../utils/styles'

import styled, { useTheme } from 'styled-components'
import { useMessageContext } from '../../../context/MessageContext'
import { useAuthContext } from '../../../context/AuthContext'
import { useEffect, useMemo, useRef, useState } from 'react'
import Avatar from '../../../components/Avatar'
import { Flex, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import route from '../../../constant/route'

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
  box-sizing: border-box;
  margin: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
`
const ScrollEnd = styled.div``
const MessageList = () => {
  const theme = useTheme()
  const {
    currConversation,
    currGroupConversation,
    params,
    contactList,
    groupContactList,
  } = useMessageContext()
  const { usrInfo } = useAuthContext()
  const msgList = useMemo(() => {
    if (params.type === 'user') {
      return currConversation?.messages || []
    }
    if (params.type === 'group') {
      return currGroupConversation?.messages || []
    }
    return []
  }, [currConversation, currGroupConversation, params.type])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true) // State to track if scrolled to bottom
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [Boolean(msgList.length)])
  // Scroll to bottom when new message is added when already at bottom
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [msgList.length])
  const findContactProfile = (contactId: number) => {
    return contactList?.find((contact) => contact.contact.id === contactId)
      ?.contact
  }

  const getAvatarInfo = () => {
    const defaultInfo = {
      firstName: '...',
      lastName: '...',
      emailForHashToColor: '...',
    }
    if (!params) return defaultInfo
    const receiverId = Number(params.receiverId)
    const contact = findContactProfile(receiverId)
    return (
      {
        firstName: contact?.firstName,
        lastName: contact?.lastName,
        emailForHashToColor: contact?.email,
      } || defaultInfo
    )
  }

  const getGroupAvatarInfo = (groupId: number, senderId: number) => {
    const defaultInfo = {
      firstName: '...',
      lastName: '...',
      emailForHashToColor: '...',
    }
    if (!params) return defaultInfo
    const user = groupContactList
      ?.find((g) => g.groupId === groupId)
      ?.groupMembers.find((member) => member.id === senderId)
    return (
      {
        firstName: user?.firstName,
        lastName: user?.lastName,
        emailForHashToColor: user?.email,
      } || defaultInfo
    )
  }

  useEffect(() => {
    if (!scrollContainerRef.current) return
    const handleScroll = () => {
      if (!scrollContainerRef.current) return
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current
      const atBottom = scrollTop + clientHeight >= scrollHeight
      setIsAtBottom(atBottom)
    }

    const scrollContainer = scrollContainerRef.current
    scrollContainer.addEventListener('scroll', handleScroll)

    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])
  const fn = (groupId: number, senderId: number) => {
    if (params.type === 'group') {
      return getGroupAvatarInfo(groupId, senderId)
    }
    return getAvatarInfo()
  }
  const navigate = useNavigate()
  return (
    <Wrapper ref={scrollContainerRef}>
      {msgList.map((msg) => (
        <Message
          style={{
            alignSelf: msg.senderId === usrInfo?.id ? 'flex-end' : 'flex-start',
          }}
          key={msg.createdAt}
        >
          <Flex align="start">
            <Flex>
              <Avatar
                onClick={() => {
                  navigate(`${route.PROFILE}/${msg.senderId}`)
                }}
                size={35}
                style={{
                  display: msg.senderId === usrInfo?.id ? 'none' : 'flex',
                }}
                firstName={fn(msg.receiverId, msg.senderId).firstName || ''}
                lastName={fn(msg.receiverId, msg.senderId).lastName || ''}
                emailForHashToColor={
                  fn(msg.receiverId, msg.senderId).emailForHashToColor || ''
                }
              ></Avatar>
            </Flex>
            <Typography.Text
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem',
                backgroundColor:
                  msg.senderId === usrInfo?.id
                    ? theme.themeColor.basicBg
                    : theme.themeColor.highlightSecondary,
              }}
            >
              {msg.content}
            </Typography.Text>
          </Flex>
        </Message>
      ))}
      <ScrollEnd ref={messagesEndRef}></ScrollEnd>
    </Wrapper>
  )
}

export default MessageList
