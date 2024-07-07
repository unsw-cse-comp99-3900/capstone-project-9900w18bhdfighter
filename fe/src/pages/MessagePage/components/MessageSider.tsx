import styled from 'styled-components'
import { Collapse, Flex, List, Tag } from 'antd'
import type { CollapseProps, FlexProps } from 'antd'
import Avatar from '../../../components/Avatar'
import ContactSearchBar from './ContactSearchBar'
import { useMessageContext } from '../../../context/MessageContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const RecentContactList = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const ContactCard = styled(Flex)`
  width: 100%;
  align-items: center;
`

type Props = Partial<FlexProps>
const MessageSider = (props: Props) => {
  const { contactList, getContacts } = useMessageContext()

  const navigate = useNavigate()
  useEffect(() => {
    getContacts()
  }, [])

  const items: CollapseProps['items'] = [
    {
      key: '2',
      label: 'Recent',
      children: (
        <List itemLayout="vertical">
          {contactList?.map((contact) => (
            <List.Item
              onClick={() => {
                navigate(`/message/user/${contact.contact.id}`)
              }}
              key={contact.contactId}
              style={{
                padding: '0.5rem 0',
                cursor: 'pointer',
              }}
            >
              <ContactCard gap={'0.5rem'}>
                <Avatar
                  firstName={contact.contact.firstName}
                  lastName={contact.contact.lastName}
                  emailForHashToColor={contact.contact.email}
                  size={35}
                ></Avatar>
                {contact.contact.firstName}
                {<Tag>{contact.unreadMsgsCount} unread</Tag>}
              </ContactCard>
            </List.Item>
          ))}
        </List>
      ),
    },
  ]

  return (
    <Flex {...props}>
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
    </Flex>
  )
}

export default MessageSider
