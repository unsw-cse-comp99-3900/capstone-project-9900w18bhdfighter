import { Flex, Typography } from 'antd'
import styled from 'styled-components'
import { getThemeColor, getThemeToken } from '../../../utils/styles'
import Avatar from '../../../components/Avatar'
import { useMessageContext } from '../../../context/MessageContext'

const Header = styled(Flex)`
  width: 100%;
  padding-bottom: ${getThemeToken('paddingXS', 'px')};
  border-bottom: 1px solid ${getThemeColor('grayscalePalette', 5)};
  align-items: center;
`
const MessageHeader = () => {
  const { currConversation, params, currGroupConversation } =
    useMessageContext()
  const { contact } = currConversation || {
    contact: {
      firstName: '...',
      lastName: '...',
      email: '...',
    },
  }
  const { groupName } = currGroupConversation || {
    groupName: '...',
  }
  if (params.type === 'user') {
    return (
      <Header gap={'0.5rem'}>
        <Avatar
          style={{
            width: '2.5rem',
            height: '2.5rem',
          }}
          firstName={contact.firstName}
          lastName={contact.lastName}
          emailForHashToColor={contact.email}
        />
        <Typography.Title
          level={4}
          onClick={() => {
            console.log(currConversation)
          }}
        >
          {`${contact.firstName} ${contact.lastName}`}
        </Typography.Title>
      </Header>
    )
  } else {
    return (
      <Header gap={'0.5rem'}>
        <Avatar
          style={{
            width: '2.5rem',
            height: '2.5rem',
          }}
          firstName={groupName}
          lastName={''}
          emailForHashToColor={groupName}
        />
        <Typography.Title level={4}>{groupName}</Typography.Title>
      </Header>
    )
  }
}

export default MessageHeader
