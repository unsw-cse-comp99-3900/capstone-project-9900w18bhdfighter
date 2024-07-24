import styled from 'styled-components'
import { Badge, Collapse, Flex, List, Tooltip, Typography } from 'antd'
import type { CollapseProps, FlexProps } from 'antd'
import Avatar from '../../../components/Avatar'

import { useMessageContext } from '../../../context/MessageContext'
import { useNavigate } from 'react-router-dom'
import ContactSearchBar from './ContactSearchBar'
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'
import route from '../../../constant/route'
import Sider from 'antd/es/layout/Sider'
import { getThemeToken } from '../../../utils/styles'
import { useGlobalTheme } from '../../../context/GlobalThemeContext'

const RecentContactList = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`
const ContentWrapper = styled(Flex)`
  padding: ${getThemeToken('paddingSM', 'px')};
  height: 100%;
`
const Mask = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`
const ContactCard = styled(Flex)`
  width: 100%;
  align-items: center;
`
const ToolTipText = ({ children }: { children: ReactNode }) => {
  const textRef = useRef<HTMLSpanElement>(null)
  const [isEllipsis, setIsEllipsis] = useState(false)

  useEffect(() => {
    if (!textRef.current) return
    const element = textRef.current
    if (element) {
      setIsEllipsis(element.scrollWidth > element.clientWidth)
    }
  }, [textRef.current])

  return (
    <Typography.Text ref={textRef} ellipsis>
      {isEllipsis ? <Tooltip title={children}>{children}</Tooltip> : children}
    </Typography.Text>
  )
}
type Props = Partial<FlexProps>
const MessageSider = (props: Props) => {
  const { contactList, groupContactList } = useMessageContext()
  const { onWidth } = useGlobalTheme()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Recent',
      children: (
        <List itemLayout="vertical">
          {contactList?.map((contact) => (
            <List.Item
              onClick={() => {
                navigate(`${route.MESSAGE}/user/${contact.contact.id}`)
                setCollapsed(true)
              }}
              key={contact.contactId}
              style={{
                padding: '0.5rem 0',
                cursor: 'pointer',
              }}
            >
              <ContactCard gap={'0.5rem'}>
                <Badge count={contact.unreadMsgsCount} overflowCount={99}>
                  <Avatar
                    firstName={contact.contact.firstName}
                    lastName={contact.contact.lastName}
                    emailForHashToColor={contact.contact.email}
                    size={35}
                  ></Avatar>
                </Badge>
                <ToolTipText>
                  {contact.contact.firstName} {contact.contact.lastName}
                </ToolTipText>
              </ContactCard>
            </List.Item>
          ))}
        </List>
      ),
    },
    {
      key: '2',
      label: 'My Groups',

      children: (
        <List itemLayout="vertical">
          {groupContactList?.map((group) => (
            <List.Item
              onClick={() => {
                navigate(`/message/group/${group.groupId}`)
                setCollapsed(true)
              }}
              key={group.groupId}
              style={{
                padding: '0.5rem 0',
                cursor: 'pointer',
              }}
            >
              <ContactCard gap={'0.5rem'}>
                <Badge count={group.unreadMsgsCount}>
                  <Avatar
                    firstName={group.groupName}
                    lastName={''}
                    emailForHashToColor={group.groupName}
                    size={35}
                  ></Avatar>
                </Badge>
                <ToolTipText>{group.groupName}</ToolTipText>
              </ContactCard>
            </List.Item>
          ))}
        </List>
      ),
    },
  ]

  return (
    <Fragment>
      <Mask visible={!collapsed} onClick={() => setCollapsed(true)} />
      <Sider
        {...props}
        collapsible={onWidth({
          md: true,
          defaultValue: false,
        })}
        collapsed={onWidth({
          md: collapsed,
          defaultValue: false,
        })}
        collapsedWidth={0}
        width={onWidth({
          md: '70%',
          defaultValue: '16rem',
        })}
        style={{
          position: onWidth({
            md: 'absolute',
            defaultValue: undefined,
          }),
          zIndex: 2,
          height: '100%',
        }}
        onCollapse={() => {
          setCollapsed(!collapsed)
        }}
      >
        <ContentWrapper vertical>
          <ContactSearchBar />
          <RecentContactList>
            <Collapse
              size="small"
              ghost
              style={{
                width: '100%',
              }}
              items={items}
              defaultActiveKey={['1', '2']}
            />
          </RecentContactList>
        </ContentWrapper>
      </Sider>
    </Fragment>
  )
}

export default MessageSider
