import { Badge, Button, Flex, Popover, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { Header } from 'antd/es/layout/layout'
import styled from 'styled-components'
import { getThemeColor } from '../../../utils/styles'
import route from '../../../constant/route'

import { IoIosNotifications } from 'react-icons/io'

import LinkButton from '../../LinkButton'
import AvatarDropdown from './AvatarDropdown'

const Wrapper = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled(LinkButton)`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-weight: bold;
  color: ${getThemeColor('primary')};
`

const OperationsGroup = styled(Flex)`
  align-items: center;
`

const HeaderNav = () => {
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ]
  return (
    <Wrapper>
      <Logo to={route.DASHBOARD}>LOGO</Logo>
      <OperationsGroup>
        <Popover
          content={<Tabs defaultActiveKey="1" items={tabItems} />}
          title="Notification"
          trigger="click"
        >
          <Button
            style={{
              marginRight: '1rem',
            }}
            shape="circle"
            type="text"
          >
            <Badge size="small" dot={true}>
              <IoIosNotifications size={'1.5rem'} />
            </Badge>
          </Button>
        </Popover>
        <AvatarDropdown />
      </OperationsGroup>
    </Wrapper>
  )
}

export default HeaderNav
