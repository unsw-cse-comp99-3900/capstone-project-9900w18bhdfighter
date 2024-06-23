import { Button, Dropdown, Flex, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { Header } from 'antd/es/layout/layout'
import styled from 'styled-components'
import { getThemeColor } from '../../../utils/styles'
import LinkButton from '../../LinkButton'
import route from '../../../constant/route'
import { Link } from 'react-router-dom'
const Wrapper = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled(LinkButton)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-weight: bold;
  margin: 0 1rem;
  border: 1px solid ${getThemeColor('grayscalePalette', 35)};
`

const Avatar = styled(Button)`
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  font-weight: bold;
  margin: 0 1rem;
  border-radius: 100%;
  border: 1px solid ${getThemeColor('grayscalePalette', 35)};
`

const OperationsGroup = styled(Flex)`
  align-items: center;
`
const items: MenuProps['items'] = [
  {
    key: 'profile',
    label: <Link to={route.PROFILE}>My Profile</Link>,
  },
  {
    key: 'logout',
    label: <Link to={route.ROOT}>Log Out</Link>,
    danger: true,
  },
]
const HeaderNav = () => (
  <Wrapper>
    <Logo type="default" to={route.DASHBOARD}>
      Logo
    </Logo>
    <OperationsGroup>
      <Typography.Text>Notifications</Typography.Text>
      <Dropdown placement="topLeft" menu={{ items }} trigger={['hover']}>
        <Avatar>Avatar</Avatar>
      </Dropdown>
    </OperationsGroup>
  </Wrapper>
)

export default HeaderNav
