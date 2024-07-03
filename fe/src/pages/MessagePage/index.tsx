import { Button, Collapse, Flex, Input, Typography, List } from 'antd'
import type { CollapseProps } from 'antd'
import styled, { useTheme } from 'styled-components'
import { getThemeColor, getThemeToken } from '../../utils/styles'
import { Msg } from '../../types/msg'
import Avatar from '../../components/Avatar'

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
const InputBox = styled(Flex)`
  width: 100%;
  background-color: ${getThemeColor('basicBg')};
  flex-direction: column;
`
const InputArea = styled(Input.TextArea)`
  width: 100%;
  background-color: ${({ theme }) => theme.colorBgBase};
  border: none; // 移除其他边的边框
  border-top: 2px solid transparent; // 默认情况下设置透明的下边框

  &:hover {
    border: none;
    border-top: 2px solid transparent;
    box-shadow: none;
    outline: none;
  }
  &:focus {
    border: none;
    border-top: 2px solid ${getThemeColor('highlight')};
    box-shadow: none;
    outline: none;
  }
`
const MessageList = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding-top: ${getThemeToken('paddingMD', 'px')};
  align-items: center;
  overflow-y: auto;
`
const SendButton = styled(Button)`
  width: fit-content;
  align-self: flex-end;
`
const Header = styled(Flex)`
  width: 100%;
  padding-bottom: ${getThemeToken('paddingXS', 'px')};
  border-bottom: 1px solid ${getThemeColor('grayscalePalette', 5)};
  align-items: center;
`
const Message = styled.div`
  background-color: ${getThemeColor('basicBg')};
  margin: 0.5rem;
  padding: 0.5rem;
  max-width: 50%;
  word-wrap: break-word;
`
const RecentContactList = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const Sider = styled(Flex)`
  padding: ${getThemeToken('paddingLG', 'px')};
  flex: 1;
  height: 100%;
  flex-direction: column;
  align-items: center;
`
const SearchBar = styled(Input.Search)``
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

const ContactCard = styled(Flex)`
  width: 100%;
  align-items: center;
`

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'Fixed',
    children: (
      <List itemLayout="vertical">
        <List.Item
          style={{
            padding: '0.5rem 0',
          }}
        >
          <ContactCard gap={'0.5rem'}>
            <Avatar
              firstName="Kenny"
              lastName="K"
              emailForHashToColor="asdd"
              size={35}
            ></Avatar>
            Kenny
          </ContactCard>
        </List.Item>
      </List>
    ),
  },
  {
    key: '2',
    label: 'Recent',
    children: (
      <List itemLayout="vertical">
        <List.Item
          style={{
            padding: '0.5rem 0',
          }}
        >
          <ContactCard gap={'0.5rem'}>
            <Avatar
              firstName="Kenny"
              lastName="K"
              emailForHashToColor="asdd"
              size={35}
            ></Avatar>
            Kenny
          </ContactCard>
        </List.Item>
        <List.Item
          style={{
            padding: '0.5rem 0',
          }}
        >
          <ContactCard gap={'0.5rem'}>
            <Avatar
              firstName="Kenny"
              lastName="K"
              emailForHashToColor="asdd"
              size={35}
            ></Avatar>
            Kenny
          </ContactCard>
        </List.Item>
        <List.Item
          style={{
            padding: '0.5rem 0',
          }}
        >
          <ContactCard gap={'0.5rem'}>
            <Avatar
              firstName="Kenny"
              lastName="K"
              emailForHashToColor="asdd"
              size={35}
            ></Avatar>
            Kenny
          </ContactCard>
        </List.Item>
      </List>
    ),
  },
]
const MessagePage = () => {
  const theme = useTheme()

  return (
    <Wrapper>
      <Container>
        <Sider>
          <SearchBar placeholder="Search for a contact" />
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
        </Sider>
        <MsgContainer>
          <Header gap={'0.5rem'}>
            <Avatar
              style={{
                width: '2.5rem',
                height: '2.5rem',
              }}
              firstName="Hang"
              lastName="H"
              emailForHashToColor="asd"
            />
            <Typography.Title level={4}>Hang</Typography.Title>
          </Header>
          <MessageList>
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
          </MessageList>
          <InputBox>
            <InputArea
              autoSize={{ minRows: 1, maxRows: 100 }}
              placeholder="Type a message"
            />
            <SendButton type="link">Send</SendButton>
          </InputBox>
        </MsgContainer>
      </Container>
    </Wrapper>
  )
}

export default MessagePage
