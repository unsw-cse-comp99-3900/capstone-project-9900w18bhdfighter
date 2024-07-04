import React from 'react'
import styled from 'styled-components'
import { getThemeToken } from '../../../utils/styles'
import { Collapse, Flex, List } from 'antd'
import type { CollapseProps } from 'antd'
import Avatar from '../../../components/Avatar'
import ContactSearchBar from './ContactSearchBar'

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

const MessageSider = () => {
  return (
    <Sider>
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
    </Sider>
  )
}

export default MessageSider
